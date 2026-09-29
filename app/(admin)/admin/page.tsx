import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PostsDataTable } from "@/components/admin/posts-table/data-table";
import { getAllPosts } from "@/lib/posts";

export const metadata = { title: "Posts · Admin" };

export default async function AdminDashboard() {
  const posts = await getAllPosts();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Posts</h1>
        <Button nativeButton={false} render={<Link href="/admin/new">New post</Link>} />
      </div>

      {posts.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No posts yet. Create your first one.
          </CardContent>
        </Card>
      ) : (
        <PostsDataTable posts={posts} />
      )}
    </div>
  );
}
