"use client";

import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { createPost, updatePost } from "@/app/(admin)/admin/actions";
import type { Post } from "@/lib/posts";

export function PostForm({ post }: { post?: Post }) {
  const action = post ? updatePost : createPost;

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

      <Field label="Slug" htmlFor="slug" hint="Leave blank to auto-generate from the title.">
        <Input
          id="slug"
          name="slug"
          defaultValue={post?.slug ?? ""}
          placeholder="a-great-blog-post"
        />
      </Field>

      <Field label="Excerpt" htmlFor="excerpt">
        <Textarea
          id="excerpt"
          name="excerpt"
          rows={2}
          defaultValue={post?.excerpt ?? ""}
          placeholder="A short summary shown on the blog index."
        />
      </Field>

      <Field label="Cover image URL" htmlFor="coverImageUrl">
        <Input
          id="coverImageUrl"
          name="coverImageUrl"
          type="url"
          defaultValue={post?.coverImageUrl ?? ""}
          placeholder="https://example.com/cover.jpg"
        />
      </Field>

      <Field label="Status" htmlFor="status">
        <select
          id="status"
          name="status"
          defaultValue={post?.status ?? "draft"}
          className="h-8 w-40 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </Field>

      <Field label="Body" htmlFor="body">
        <RichTextEditor name="body" defaultValue={post?.body ?? ""} />
      </Field>

      <div className="flex items-center gap-2">
        <SubmitButton isEdit={Boolean(post)} />
        <Button
          variant="ghost"
          nativeButton={false}
          render={<Link href="/admin">Cancel</Link>}
        />
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
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
