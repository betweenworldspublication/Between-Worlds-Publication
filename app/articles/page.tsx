import Link from "next/link";
import { client } from "../../lib/sanity";

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

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
  const articles: Article[] = await client.fetch(`
    *[_type == "article"] | order(publishedAt desc, _createdAt desc) {
      _id,
      title,
      excerpt,
      publishedAt,
      _createdAt,
      slug
    }
  `);

  const noteRotations = [
    "rotate-[-1deg]",
    "rotate-[1deg]",
    "rotate-[-0.75deg]",
    "rotate-[0.75deg]",
    "rotate-[1.25deg]",
    "rotate-[-1.25deg]",
  ];

  const noteBackgrounds = [
    "bg-amber-50/85",
    "bg-orange-50/85",
    "bg-yellow-50/85",
    "bg-stone-50/90",
    "bg-amber-100/80",
    "bg-orange-100/75",
  ];

  return (
    <main className="min-h-screen bg-amber-100 font-serif text-stone-900">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <Link
          href="/"
          className="inline-block bg-amber-50/70 px-5 py-3 text-sm font-medium text-stone-900 transition hover:bg-amber-50"
        >
          ← Return Home
        </Link>

        <section className="mx-auto mt-10 mb-14 max-w-3xl text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.22em] text-amber-900/60">
            Archive
          </p>

          <h1 className="text-5xl font-semibold leading-tight text-stone-900 md:text-6xl">
            All Articles
          </h1>

          <div className="mx-auto mt-6 h-px w-20 bg-amber-900/20" />

          <p className="mt-8 text-lg leading-8 text-stone-800">
            Browse the full collection of published writing across history,
            commentary, culture, poetry, fiction, and reflection.
          </p>
        </section>

        {articles.length > 0 ? (
          <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => {
              const rotation = noteRotations[index % noteRotations.length];
              const bg = noteBackgrounds[index % noteBackgrounds.length];

              const content = (
                <article
                  className={`${bg} ${rotation} min-h-[320px] p-6 shadow-sm transition hover:-translate-y-1 hover:rotate-0 hover:shadow-md cursor-pointer`}
                >
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.14em] text-amber-900/60">
                    <span>Article</span>
                    <span>
                      {article.publishedAt
                        ? new Date(article.publishedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : article._createdAt
                        ? new Date(article._createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Draft"}
                    </span>
                  </div>

                  <h2 className="mt-4 text-2xl font-semibold leading-snug text-stone-900">
                    {article.title}
                  </h2>

                  <div className="mt-3 h-px w-12 bg-amber-900/20" />

                  <p className="mt-4 line-clamp-5 text-base leading-8 text-stone-800">
                    {article.excerpt || "No excerpt yet."}
                  </p>
                </article>
              );

              return article.slug?.current ? (
                <Link
                  key={article._id}
                  href={`/articles/${article.slug.current}`}
                  className="block"
                >
                  {content}
                </Link>
              ) : (
                <div key={article._id} className="block">
                  {content}
                </div>
              );
            })}
          </section>
        ) : (
          <section className="bg-amber-50/35 p-6 shadow-sm">
            <p className="text-base leading-8 text-stone-800">
              No articles published yet. Create one in Sanity Studio to see it
              here.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}