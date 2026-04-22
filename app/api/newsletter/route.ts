import { NextResponse } from "next/server";
import { promises as dns } from "dns";
import { Resend } from "resend";
import { sanityWriteClient } from "../../../lib/sanityWrite";
import { client } from "../../../lib/sanity";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);

function isValidEmailFormat(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getDomainFromEmail(email: string) {
  return email.split("@")[1]?.toLowerCase();
}

async function hasRealMailDomain(domain: string) {
  try {
    const mx = await dns.resolveMx(domain);
    if (mx.length > 0) return true;
  } catch {}

  try {
    const a = await dns.resolve4(domain);
    if (a.length > 0) return true;
  } catch {}

  try {
    const aaaa = await dns.resolve6(domain);
    if (aaaa.length > 0) return true;
  } catch {}

  return false;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body.email?.trim().toLowerCase();

    if (!email || !isValidEmailFormat(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const domain = getDomainFromEmail(email);

    if (!domain) {
      return NextResponse.json(
        { error: "Invalid email domain." },
        { status: 400 }
      );
    }

    const validDomain = await hasRealMailDomain(domain);

    if (!validDomain) {
      return NextResponse.json(
        { error: "That email domain does not appear to receive mail." },
        { status: 400 }
      );
    }

    // Check for duplicate in Sanity
    const existingSubscriber = await client.fetch(
      `*[_type == "subscriber" && email == $email][0]{
        _id,
        email
      }`,
      { email }
    );

    if (existingSubscriber?._id) {
      return NextResponse.json(
        { error: "That email is already subscribed." },
        { status: 409 }
      );
    }

    // Store new subscriber
    const created = await sanityWriteClient.create({
      _type: "subscriber",
      email,
      subscribedAt: new Date().toISOString(),
    });

    // Optional: notify you by email
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: "Between Worlds <onboarding@resend.dev>",
        to: ["YOUR_EMAIL@example.com"],
        subject: "New newsletter signup",
        text: `New newsletter subscriber: ${email}\nSubscriber ID: ${created._id}`,
      });
    }

    return NextResponse.json({
      success: true,
      id: created._id,
      message: "You’ve been added to the newsletter.",
    });
  } catch (error: any) {
    console.error("Newsletter signup error:", error);

    return NextResponse.json(
      { error: error?.message || "Failed to process newsletter signup." },
      { status: 500 }
    );
  }
}