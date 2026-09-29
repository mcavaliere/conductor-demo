"use client";

import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Post } from "@/lib/posts";

const textareaClassName =
  "min-h-32 w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30";

export function PostForm({
  post,
  action,
}: {
  post?: Post;
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <form action={action} className="flex flex-col gap-5">
      {post && <input type="hidden" name="id" value={post.id} />}

      <Field label="Title" htmlFor="title">
        <Input
          id="title"
          name="title"
          required
          defaultValue={post?.title ?? ""}
          placeholder="A great blog post"
        />
      </Field>

      <Field label="Slug" htmlFor="slug">
        <Input
          id="slug"
          name="slug"
          required
          defaultValue={post?.slug ?? ""}
          placeholder="a-great-blog-post"
        />
      </Field>

      <Field label="Excerpt" htmlFor="excerpt">
        <textarea
          id="excerpt"
          name="excerpt"
          rows={2}
          defaultValue={post?.excerpt ?? ""}
          placeholder="A short summary shown on the blog index."
          className={textareaClassName}
        />
      </Field>

      <Field label="Content" htmlFor="content">
        <textarea
          id="content"
          name="content"
          required
          rows={10}
          defaultValue={post?.content ?? ""}
          placeholder="<p>Post body (HTML)</p>"
          className={textareaClassName}
        />
      </Field>

      <div className="flex items-center gap-2">
        <input
          id="published"
          name="published"
          type="checkbox"
          defaultChecked={post?.published ?? false}
          className="size-4 rounded border-input"
        />
        <Label htmlFor="published" className="cursor-pointer">
          Published
        </Label>
      </div>

      <div className="flex items-center gap-2">
        <SubmitButton isEdit={Boolean(post)} />
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/admin/posts">Cancel</Link>}
        />
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving…" : isEdit ? "Save changes" : "Create post"}
    </Button>
  );
}
