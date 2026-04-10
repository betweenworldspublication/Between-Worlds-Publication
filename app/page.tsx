import Link from "next/link";
import { client } from "../lib/sanity";

export const revalidate = 0;
export const dynamic = "force-dynamic";

type Article = {
  _id: string;
  title: string;
  excerpt?: string;
  publishedAt?: string;
  _createdAt?: string;
  slug?: {
    current: string;
  };
};

export default async function Home() {
  const featured: Article[] = await client.fetch(`
  *[_type == "article"] | order(publishedAt desc, _createdAt desc)[0...3] {
    _id,
    title,
    excerpt,
    publishedAt,
    _createdAt,
    slug
  }
`);

  const archive = [
    "History",
    "Research & Analysis",
    "Commentary",
    "Poetry",
    "Fiction",
    "Personal Journal",
  ];

  return (
    <div className="min-h-screen bg-amber-100 font-serif text-stone-900">
      <header className="bg-amber-100/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
              Between Worlds
            </h1>
            <p className="mt-2 text-sm leading-6 text-stone-700">
              Bridging the culture gap between East and West
            </p>
          </div>

          <nav className="hidden gap-6 text-sm text-stone-700 md:flex">
            <a href="#featured" className="transition hover:text-amber-900">
              Featured
            </a>
            <a href="#archive" className="transition hover:text-amber-900">
              Archive
            </a>
            <a href="#about" className="transition hover:text-amber-900">
              About
            </a>
            <a href="#contact" className="transition hover:text-amber-900">
              Contact
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl gap-14 px-6 py-20 md:grid-cols-[1.2fr_.8fr] md:items-start">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.22em] text-amber-900/60">
              Add some color to your book of life
            </p>

            <h2 className="max-w-3xl text-5xl font-semibold leading-tight text-stone-900 md:text-7xl">
              Connecting with cultures through storytelling.
            </h2>

            <div className="mt-6 h-px w-20 bg-amber-900/20" />

            <p className="mt-8 max-w-2xl text-lg leading-8 text-stone-800">
              Publishing and translating works of history, tradition, and
              experience to bridge the culture gap between different worlds.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#featured"
                className="bg-stone-900 px-5 py-3 text-sm font-medium text-amber-50 transition hover:bg-amber-900"
              >
                Read featured work
              </a>
              <a
                href="#about"
                className="bg-amber-50/70 px-5 py-3 text-sm font-medium text-stone-900 transition hover:bg-amber-50"
              >
                About the publication
              </a>
            </div>
          </div>

          <div className="bg-amber-50/45 p-7 shadow-sm">
            <p className="text-xs uppercase tracking-[0.22em] text-amber-900/60">
              Current focus
            </p>
            <h3 className="mt-3 text-3xl font-semibold text-stone-900">
              The Chinese Noodle
            </h3>
            <div className="mt-4 h-px w-16 bg-amber-900/20" />
            <p className="mt-5 text-base leading-8 text-stone-800">
              With a focus on Chinese history, this chapter of the Between
              Worlds publication seeks to connect people living in the West with
              the rich traditions of China via the cultural superstar food,
              noodles.
            </p>
          </div>
        </section>

        <section id="featured" className="mx-auto max-w-6xl px-6 py-8">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-amber-900/60">
                Featured
              </p>
              <h3 className="mt-3 text-4xl font-semibold text-stone-900">
                Recent Writing
              </h3>
            </div>
            <p className="hidden text-sm text-stone-600 md:block">
              Recent publications
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            {featured.length > 0 ? (
              featured.map((piece) => (
                <article
                  key={piece._id}
                  className="bg-amber-50/35 p-6 shadow-sm transition hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.14em] text-amber-900/60">
                    <span>Article</span>
                    <span>
                    {piece.publishedAt
                      ? new Date(piece.publishedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : piece._createdAt
                      ? new Date(piece._createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Draft"}
                  </span>
                  </div>

                  <h4 className="mt-4 text-2xl font-semibold text-stone-900">
                    {piece.title}
                  </h4>

                  <div className="mt-3 h-px w-12 bg-amber-900/20" />

                  <p className="mt-4 text-base leading-8 text-stone-800">
                    {piece.excerpt || "No excerpt yet."}
                  </p>

                  {piece.slug?.current ? (
                    <Link
                      href={`/articles/${piece.slug.current}`}
                      className="mt-5 inline-block text-sm text-amber-900/80 underline underline-offset-4"
                    >
                      Read piece
                    </Link>
                  ) : (
                    <span className="mt-5 inline-block text-sm text-stone-500">
                      No link yet
                    </span>
                  )}
                </article>
              ))
            ) : (
              <div className="bg-amber-50/35 p-6 shadow-sm md:col-span-3">
                <p className="text-base leading-8 text-stone-800">
                  No articles published yet. Create one in Sanity Studio to see
                  it here.
                </p>
              </div>
            )}
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-6">
          <div className="h-px bg-amber-900/10" />
        </div>

        <section id="archive" className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-12 md:grid-cols-[.8fr_1.2fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-amber-900/60">
                Archive
              </p>
              <h3 className="mt-3 text-4xl font-semibold text-stone-900">
                Browse by type
              </h3>
              <div className="mt-4 h-px w-16 bg-amber-900/20" />
              <p className="mt-6 text-base leading-8 text-stone-800">
                Wander through history, commentary, poetry, fiction, and
                personal reflection gathered across different worlds.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {archive.map((item) => (
                <div
                  key={item}
                  className="bg-amber-50/30 px-5 py-4 text-base font-medium text-stone-900 shadow-sm"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-6">
          <div className="h-px bg-amber-900/10" />
        </div>

        <section id="about" className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-amber-900/60">
                About
              </p>
              <h3 className="mt-3 text-4xl font-semibold text-stone-900">
                Between Worlds
              </h3>
              <div className="mt-4 h-px w-16 bg-amber-900/20" />
            </div>

            <div className="space-y-5 text-base leading-8 text-stone-800">
              <p>
                Between Worlds is an independent publication created to spread
                awareness to the stories of different cultures that may never
                get told.
              </p>
              <p className="italic text-stone-700">
                Throughout history, stories, whether oral and written, poetry
                and prose, even video and art have stood the ultimate test of
                time as the vehicle of the human race to express themselves.
              </p>
              <p>
                Reach out and tell your story today via the contacts below.
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-6">
          <div className="h-px bg-amber-900/10" />
        </div>

        <section id="contact" className="mx-auto max-w-6xl px-6 py-20">
          <div className="bg-stone-900 px-8 py-10 text-amber-50 shadow-sm md:px-10">
            <p className="text-xs uppercase tracking-[0.22em] text-amber-200/70">
              Contact
            </p>
            <h3 className="mt-3 text-4xl font-semibold">
              Open to readers, editors, and collaborators
            </h3>
            <div className="mt-4 h-px w-16 bg-amber-100/20" />
            <p className="mt-6 max-w-2xl text-base leading-8 text-amber-50/85">
              Add your email, newsletter link, or social links here so people
              can reach out after reading your work.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="mailto:hello@example.com"
                className="bg-amber-100 px-5 py-3 text-sm font-medium text-stone-900 transition hover:bg-white"
              >
                Email
              </a>
              <a
                href="#featured"
                className="bg-white/10 px-5 py-3 text-sm font-medium text-amber-50 transition hover:bg-white/15"
              >
                View featured writing
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}