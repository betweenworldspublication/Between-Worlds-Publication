import Link from "next/link";
import { client } from "../../../lib/sanity";
import { PortableText } from "@portabletext/react";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

type Article = {
  title: string;
  publishedAt?: string;
  excerpt?: string;
  body?: any[];
};

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

  const article: Article | null = await client.fetch(
    `
    *[_type == "article" && slug.current == $slug][0]{
      title,
      publishedAt,
      excerpt,
      body
    }
    `,
    { slug }
  );

  if (!article) {
    return (
      <main className="min-h-screen bg-amber-100 px-6 py-20 font-serif text-stone-900">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/"
            className="mb-8 inline-block text-sm text-stone-700 transition hover:text-amber-900"
          >
            ← Back to Home
          </Link>

          <h1 className="text-4xl font-semibold">Article not found</h1>
          <p className="mt-4 text-base leading-8 text-stone-800">
            This piece may not be published yet, or its link may be incorrect.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-amber-100 px-6 py-20 font-serif text-stone-900">
      <article className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-8 inline-block text-sm text-stone-700 transition hover:text-amber-900"
        >
          ← Back to Home
        </Link>

        <p className="text-xs uppercase tracking-[0.22em] text-amber-900/60">
          Article
        </p>

        <h1 className="mt-4 text-5xl font-semibold leading-tight text-stone-900">
          {article.title}
        </h1>

        <div className="mt-6 h-px w-20 bg-amber-900/20" />

        <div className="mt-6 text-sm text-stone-700">
          {article.publishedAt
            ? new Date(article.publishedAt).toLocaleDateString()
            : "Draft"}
        </div>

        {article.excerpt && (
          <p className="mt-8 text-xl leading-9 text-stone-800 italic">
            {article.excerpt}
          </p>
        )}

        <div className="prose prose-stone mt-10 max-w-none leading-8">
          {article.body ? <PortableText value={article.body} /> : null}
        </div>
      </article>
    </main>
  );
}