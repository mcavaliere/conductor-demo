import { PostForm } from "@/components/admin/post-form";

export const metadata = { title: "New post · Admin" };

export default function NewPostPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold tracking-tight">New post</h1>
      <PostForm />
    </div>
  );
}
