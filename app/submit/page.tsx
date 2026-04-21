"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";

const storyTypes = [
  "History",
  "Research & Analysis",
  "Commentary",
  "Poetry",
  "Fiction",
  "Personal Journal",
  "Translation",
  "Culture",
];

export default function SubmitPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [storyType, setStoryType] = useState<string[]>([]);
  const [story, setStory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const wordCount = useMemo(() => {
    return story.trim() ? story.trim().split(/\s+/).length : 0;
  }, [story]);

  function toggleTag(tag: string) {
    setStoryType((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag]
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (wordCount < 200) {
      setError("Your story must be at least 200 words.");
      return;
    }

    if (storyType.length === 0) {
      setError("Please select at least one story type.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          title,
          storyType,
          story,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setSuccess("Your story has been sent successfully.");
      setName("");
      setEmail("");
      setTitle("");
      setStoryType([]);
      setStory("");
    } catch (err) {
      setError("Something went wrong while sending your submission.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-amber-100 px-6 py-16 font-serif text-stone-900">
      <div className="mx-auto max-w-3xl bg-amber-50/40 p-8 shadow-sm">
      
        <Link
        href="/"
        className="inline-block mb-6 text-sm text-stone-700 hover:text-amber-900 transition"
        >
        ← Back to Home
        </Link>

        <p className="text-xs uppercase tracking-[0.22em] text-amber-900/60">
          Submit
        </p>
        <h1 className="mt-3 text-4xl font-semibold">Submit Your Story</h1>
        <div className="mt-4 h-px w-16 bg-amber-900/20" />
        <p className="mt-6 text-base leading-8 text-stone-800">
          Send your writing for review. Submissions must be at least 200 words.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white px-4 py-3 text-sm text-stone-900 outline-none ring-1 ring-stone-200 focus:ring-stone-400"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white px-4 py-3 text-sm text-stone-900 outline-none ring-1 ring-stone-200 focus:ring-stone-400"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Story Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white px-4 py-3 text-sm text-stone-900 outline-none ring-1 ring-stone-200 focus:ring-stone-400"
              required
            />
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium">Story Type</label>
            <div className="flex flex-wrap gap-3">
              {storyTypes.map((tag) => {
                const selected = storyType.includes(tag);

                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-2 text-sm transition ${
                      selected
                        ? "bg-stone-900 text-amber-50"
                        : "bg-amber-50 text-stone-900 ring-1 ring-stone-200 hover:bg-amber-100"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-medium">Your Story</label>
              <span className="text-xs text-stone-600">{wordCount} words</span>
            </div>
            <textarea
              value={story}
              onChange={(e) => setStory(e.target.value)}
              rows={14}
              className="w-full bg-white px-4 py-3 text-sm leading-7 text-stone-900 outline-none ring-1 ring-stone-200 focus:ring-stone-400"
              placeholder="Write or paste your story here..."
              required
            />
            <p className="mt-2 text-xs text-stone-600">
              Minimum: 200 words
            </p>
          </div>

          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          {success ? (
            <div className="space-y-4">
                <p className="text-sm text-green-700">{success}</p>

                <Link
                href="/"
                className="inline-block bg-amber-50 px-5 py-3 text-sm font-medium text-stone-900 transition hover:bg-amber-100 ring-1 ring-stone-200"
                >
                ← Back to Home
                </Link>
            </div>
            ) : null}

          <div className="flex flex-wrap gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-stone-900 px-5 py-3 text-sm font-medium text-amber-50 transition hover:bg-amber-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Sending..." : "Send Story"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}