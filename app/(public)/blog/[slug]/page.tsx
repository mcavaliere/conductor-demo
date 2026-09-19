import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedPostBySlug } from "@/lib/posts";
import { sanitizePostBody } from "@/lib/sanitize";
import { formatDate } from "@/lib/format";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return { title: "Not found" };
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <Link
        href="/blog"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to blog
      </Link>

      <article className="mt-6">
        <h1 className="text-3xl font-semibold tracking-tight">{post.title}</h1>
        {post.publishedAt && (
          <p className="mt-2 text-sm text-muted-foreground">
            {formatDate(post.publishedAt)}
          </p>
        )}
        {post.coverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImageUrl}
            alt=""
            className="mt-6 w-full rounded-xl object-cover"
          />
        )}
        <div
          className="prose prose-sm dark:prose-invert mt-8 max-w-none"
          // Sanitized on write and again here on render.
          dangerouslySetInnerHTML={{ __html: sanitizePostBody(post.body) }}
        />
      </article>
    </main>
  );
}
