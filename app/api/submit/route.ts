import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getWordCount(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = body.name?.trim();
    const email = body.email?.trim();
    const title = body.title?.trim();
    const story = body.story?.trim();
    const storyType = Array.isArray(body.storyType) ? body.storyType : [];

    if (!name) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "A valid email is required." },
        { status: 400 }
      );
    }

    if (!title) {
      return NextResponse.json(
        { error: "Story title is required." },
        { status: 400 }
      );
    }

    if (!story) {
      return NextResponse.json(
        { error: "Story text is required." },
        { status: 400 }
      );
    }

    if (getWordCount(story) < 200) {
      return NextResponse.json(
        { error: "Story must be at least 200 words." },
        { status: 400 }
      );
    }

    if (storyType.length === 0) {
      return NextResponse.json(
        { error: "Select at least one story type." },
        { status: 400 }
      );
    }

    const formattedTags = storyType.join(", ");

    await resend.emails.send({
      from: "Between Worlds <onboarding@resend.dev>",
      to: ["justinw071019@gmail.com"],
      replyTo: email,
      subject: `New Story Submission: ${title}`,
      text: `
New story submission for Between Worlds

Name: ${name}
Email: ${email}
Title: ${title}
Story Type: ${formattedTags}

Story:
${story}
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Submission email error:", error);
    return NextResponse.json(
      { error: "Failed to send submission." },
      { status: 500 }
    );
  }
}