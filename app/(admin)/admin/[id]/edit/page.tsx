import { notFound } from "next/navigation";
import { PostForm } from "@/components/admin/post-form";
import { getPostById } from "@/lib/posts";

export const metadata = { title: "Edit post · Admin" };

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold tracking-tight">Edit post</h1>
      <PostForm post={post} />
    </div>
  );
}
