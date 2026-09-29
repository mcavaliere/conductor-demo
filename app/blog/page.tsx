import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getPublishedPosts } from "@/lib/posts";

export const metadata = {
  title: "Blog",
  description: "Latest posts",
};

function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="mb-8 text-3xl font-semibold tracking-tight">Blog</h1>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">No posts published yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="block">
              <Card className="transition-colors hover:bg-muted/40">
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  {post.excerpt && (
                    <CardDescription>{post.excerpt}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  {formatDate(post.createdAt)}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
