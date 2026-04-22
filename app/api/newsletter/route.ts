import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body.email?.trim().toLowerCase();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email." },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: "Between Worlds <onboarding@resend.dev>",
      to: ["justinw071019@gmail.com"],
      subject: "New newsletter signup",
      text: `New newsletter subscriber: ${email}`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Newsletter signup error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process signup." },
      { status: 500 }
    );
  }
}