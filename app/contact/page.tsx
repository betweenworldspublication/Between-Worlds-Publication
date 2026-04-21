"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function ContactPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setSuccess("You’ve been added to the newsletter.");
      setEmail("");
    } catch (err) {
      setError("Something went wrong while signing up.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-amber-100 font-serif text-stone-900">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <Link
          href="/"
          className="inline-block bg-amber-50/70 px-5 py-3 text-sm font-medium text-stone-900 transition hover:bg-amber-50"
        >
          ← Return Home
        </Link>

        <section className="mx-auto mt-10 grid gap-10 md:grid-cols-[1fr_.95fr]">
          <div className="bg-amber-50/40 p-8 shadow-sm">
            <p className="text-xs uppercase tracking-[0.22em] text-amber-900/60">
              Contact
            </p>
            <h1 className="mt-3 text-5xl font-semibold leading-tight text-stone-900">
              Get in Touch
            </h1>
            <div className="mt-6 h-px w-20 bg-amber-900/20" />

            <p className="mt-8 text-base leading-8 text-stone-800">
              Reach out with submissions, questions, collaborations, or editorial
              inquiries.
            </p>

            <div className="mt-10 space-y-6 text-base leading-8 text-stone-800">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-amber-900/60">
                  Email
                </p>
                <a
                  href="justinw071019@gmail.com"
                  className="mt-2 inline-block text-lg text-stone-900 underline underline-offset-4"
                >
                  justinw071019@gmail.com
                </a>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-amber-900/60">
                  Newsletter
                </p>
                <p className="mt-2">
                  Join the mailing list to hear when new writing is published.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50/55 p-8 shadow-sm">
            <p className="text-xs uppercase tracking-[0.22em] text-amber-900/60">
              Sign Up
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-stone-900">
              Join the Newsletter
            </h2>
            <div className="mt-4 h-px w-16 bg-amber-900/20" />

            <p className="mt-6 text-base leading-8 text-stone-800">
              Leave your email and get notified when a new article goes live.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-amber-50 px-4 py-3 text-sm text-stone-900 outline-none ring-1 ring-stone-200 focus:ring-stone-400"
                  placeholder="you@example.com"
                  required
                />
              </div>

              {error ? <p className="text-sm text-red-700">{error}</p> : null}
              {success ? <p className="text-sm text-green-700">{success}</p> : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-stone-900 px-5 py-3 text-sm font-medium text-amber-50 transition hover:bg-amber-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Joining..." : "Join Newsletter"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}