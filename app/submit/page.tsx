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

  const inputClass =
    "w-full rounded-2xl border border-stone-200/80 bg-stone-50/80 px-4 py-3.5 text-[15px] text-stone-900 placeholder:text-stone-400 outline-none transition focus:border-amber-700/40 focus:bg-amber-50/70 focus:ring-4 focus:ring-amber-100";

  return (
    <main className="min-h-screen bg-amber-100">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-stone-300/70 bg-amber-50/70 px-4 py-2 text-sm font-medium text-stone-700 backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-amber-50"
        >
          <span aria-hidden="true">←</span>
          Back to Home
        </Link>

        <div className="overflow-hidden rounded-[2rem] border border-stone-200/70 bg-[#fbf6ec]/95 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="relative px-7 py-10 sm:px-10 sm:py-12">
              <div className="absolute left-0 top-0 h-full w-[10px] bg-gradient-to-b from-amber-200/70 via-transparent to-rose-200/60" />

              <div className="max-w-2xl">
                <div className="inline-block rounded-full bg-amber-200/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-950/70">
                  Submit
                </div>

                <h1 className="mt-5 text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
                  Submit Your Story
                </h1>

                <p className="mt-5 max-w-xl text-[16px] leading-8 text-stone-700">
                  Send your writing for editorial review. We are looking for work
                  that feels thoughtful, vivid, and human. Submissions must be at
                  least 200 words.
                </p>

                <form onSubmit={handleSubmit} className="mt-10 space-y-8">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2.5 block text-sm font-medium text-stone-800">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={inputClass}
                        placeholder="Name or Pseudonym"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2.5 block text-sm font-medium text-stone-800">
                        Your Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClass}
                        placeholder="Where can we reach you?"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2.5 block text-sm font-medium text-stone-800">
                      Story Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className={inputClass}
                      placeholder="Give your piece a title"
                      required
                    />
                  </div>

                  <div>
                    <div className="mb-3 flex items-center justify-between gap-4">
                      <label className="block text-sm font-medium text-stone-800">
                        Story Type
                      </label>
                      <span className="text-xs text-stone-500">
                        Choose one or more
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {storyTypes.map((tag, index) => {
                        const selected = storyType.includes(tag);

                        const chipColors = [
                          "bg-amber-100/80",
                          "bg-rose-100/80",
                          "bg-orange-100/80",
                          "bg-lime-100/80",
                          "bg-sky-100/80",
                          "bg-violet-100/80",
                          "bg-teal-100/80",
                          "bg-yellow-100/80",
                        ];

                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => toggleTag(tag)}
                            className={`rounded-full border px-4 py-2.5 text-sm transition ${
                              selected
                                ? "border-stone-900 bg-stone-900 text-amber-50 shadow-sm"
                                : `border-stone-200 text-stone-800 hover:-translate-y-0.5 hover:border-stone-300 ${chipColors[index % chipColors.length]}`
                            }`}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="mb-2.5 flex items-center justify-between gap-4">
                      <label className="block text-sm font-medium text-stone-800">
                        Your Story
                      </label>
                      <span
                        className={`text-xs ${
                          wordCount >= 200 ? "text-green-700" : "text-stone-500"
                        }`}
                      >
                        {wordCount} / 200 words
                      </span>
                    </div>

                    <textarea
                      value={story}
                      onChange={(e) => setStory(e.target.value)}
                      rows={14}
                      className="w-full rounded-[1.5rem] border border-stone-200/80 bg-gradient-to-b from-[#f8f1e4] to-[#f5ecdc] px-5 py-4 text-[15px] leading-8 text-stone-900 placeholder:text-stone-400 outline-none transition focus:border-amber-700/40 focus:ring-4 focus:ring-amber-100"
                      placeholder="Write or paste your story here..."
                      required
                    />

                    
                  </div>

                  {error ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  ) : null}

                  {success ? (
                    <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-4 text-sm text-green-800">
                      <p>{success}</p>
                      <Link
                        href="/"
                        className="mt-3 inline-flex items-center gap-2 font-medium text-stone-800 underline underline-offset-4"
                      >
                        <span aria-hidden="true">←</span>
                        Back to Home
                      </Link>
                    </div>
                  ) : null}

                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-full bg-stone-900 px-6 py-3.5 text-sm font-medium text-amber-50 transition hover:-translate-y-0.5 hover:bg-amber-900 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? "Sending..." : "Send Story"}
                    </button>

                    <p className="text-sm text-stone-500">
                      Your submission will be reviewed before anything is published.
                    </p>
                  </div>
                </form>
              </div>
            </section>

            <aside className="border-t border-stone-200/70 bg-[linear-gradient(to_bottom,_rgba(255,248,235,0.9),_rgba(248,235,214,0.95))] px-7 py-10 sm:px-10 lg:border-l lg:border-t-0">
              <div className="space-y-6">
                <div className="rounded-[1.75rem] bg-[#f7e7cf] p-6 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.2em] text-amber-950/50">
                    Editorial Note
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-900">
                    Thoughtful, vivid, and personal
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-stone-700">
                    We are interested in writing that bridges cultures — history,
                    memory, language, reflection, and lived experience.
                  </p>
                </div>

                <div className="rotate-[-1.5deg] rounded-[1.5rem] border border-amber-200/70 bg-amber-100/80 p-5 shadow-sm">
                  <p className="text-sm font-medium text-stone-800">
                    A good submission does not need to feel overly formal.
                  </p>
                  <p className="mt-2 text-sm leading-7 text-stone-700">
                    It should feel alive and intentional.
                  </p>
                </div>

                <div className="rounded-[1.75rem] border border-stone-200/70 bg-stone-50/75 p-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                    Before you send
                  </p>

                  <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-700">
                    <li>• Include a title that matches the spirit of the piece.</li>
                    <li>• Choose at least one story type.</li>
                    <li>• Make sure your story is meaningful to you.</li>
                    <li>• Double-check your email so we can reply.</li>
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}