import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getPublishedPosts } from "@/lib/posts";
import { formatDate } from "@/lib/format";

export const metadata = {
  title: "Blog",
  description: "Latest posts",
};

export default async function BlogIndex() {
  const posts = await getPublishedPosts();

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">Blog</h1>

      {posts.length === 0 ? (
        <p className="text-sm text-muted-foreground">No posts published yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="block">
              <Card className="transition-colors hover:bg-muted/40">
                {post.coverImageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.coverImageUrl}
                    alt=""
                    className="h-40 w-full object-cover"
                  />
                )}
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  {post.excerpt && (
                    <CardDescription>{post.excerpt}</CardDescription>
                  )}
                </CardHeader>
                {post.publishedAt && (
                  <CardContent className="text-xs text-muted-foreground">
                    {formatDate(post.publishedAt)}
                  </CardContent>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
