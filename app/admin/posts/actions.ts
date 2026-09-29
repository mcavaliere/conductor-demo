"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { createPost, deletePost, getPostById, updatePost } from "@/lib/posts";
import { isAdminClaims } from "@/lib/admin";

/**
 * Defense in depth: `proxy.ts` already blocks non-admins from *navigating*
 * to `/admin/posts`, but Server Actions are directly reachable as POST
 * requests regardless of proxy matchers (see Next's Server Actions security
 * guide, node_modules/next/dist/docs/.../02-guides/server-actions.md), so
 * every action re-checks the caller here too.
 */
async function requireAdmin(): Promise<string> {
  const { userId, sessionClaims } = await auth();
  if (!userId || !isAdminClaims(sessionClaims)) {
    throw new Error("Forbidden: admin access required");
  }
  return userId;
}

function revalidatePostPaths(slug?: string, previousSlug?: string) {
  revalidatePath("/admin/posts");
  revalidatePath("/blog");
  if (slug) revalidatePath(`/blog/${slug}`);
  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/blog/${previousSlug}`);
  }
}

export async function createPostAction(formData: FormData): Promise<void> {
  const authorId = await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const published = formData.get("published") === "on";

  if (!title) throw new Error("Title is required");
  if (!slug) throw new Error("Slug is required");
  if (!content) throw new Error("Content is required");

  const post = await createPost({
    title,
    slug,
    content,
    excerpt: excerpt || null,
    published,
    authorId,
  });

  revalidatePostPaths(post.slug);
  redirect("/admin/posts");
}

export async function updatePostAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing post id");

  const existing = await getPostById(id);
  if (!existing) throw new Error("Post not found");

  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const published = formData.get("published") === "on";

  if (!title) throw new Error("Title is required");
  if (!slug) throw new Error("Slug is required");
  if (!content) throw new Error("Content is required");

  const updated = await updatePost(id, {
    title,
    slug,
    content,
    excerpt: excerpt || null,
    published,
  });
  if (!updated) throw new Error("Post not found");

  revalidatePostPaths(updated.slug, existing.slug);
  redirect("/admin/posts");
}

export async function deletePostAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing post id");

  const existing = await getPostById(id);
  await deletePost(id);

  revalidatePostPaths(undefined, existing?.slug);
}
