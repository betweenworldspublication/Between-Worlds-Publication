import { NextResponse } from "next/server";
import { sanityWriteClient } from "../../../lib/sanityWrite";

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

    const created = await sanityWriteClient.create({
      _type: "subscriber",
      email,
      subscribedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, id: created._id });
  } catch (error: any) {
    console.error("Newsletter signup error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to save subscriber." },
      { status: 500 }
    );
  }
}