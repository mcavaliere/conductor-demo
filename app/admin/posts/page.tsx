import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DeletePostButton } from "@/components/admin/delete-post-button";
import { getAllPosts } from "@/lib/posts";

export const metadata = { title: "Posts · Admin" };

function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function AdminPostsPage() {
  const posts = await getAllPosts();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Posts</h1>
        <Button
          nativeButton={false}
          render={<Link href="/admin/posts/new">New post</Link>}
        />
      </div>

      {posts.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No posts yet. Create your first one.
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-2 font-medium">Title</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Updated</th>
                <th className="px-4 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-t border-border">
                  <td className="px-4 py-2 font-medium">{post.title}</td>
                  <td className="px-4 py-2">
                    <span
                      className={
                        post.published
                          ? "rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                          : "rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                      }
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-muted-foreground">
                    {formatDate(post.updatedAt)}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        nativeButton={false}
                        render={
                          <Link href={`/admin/posts/${post.id}/edit`}>
                            Edit
                          </Link>
                        }
                      />
                      <DeletePostButton
                        postId={post.id}
                        postTitle={post.title}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
