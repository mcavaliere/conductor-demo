"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/src/prisma/db";
import { uniqueSlug } from "@/lib/slug";
import { sanitizePostBody } from "@/lib/sanitize";
import { isAdminClaims } from "@/lib/admin";

async function requireUserId(): Promise<string> {
  const { userId, sessionClaims } = await auth();
  if (!userId) throw new Error("Unauthorized");
  if (!isAdminClaims(sessionClaims)) throw new Error("Forbidden: admin role required");
  return userId;
}

/** Empty string → null; otherwise validate as a URL and return it. */
function parseUrl(value: FormDataEntryValue | null): string | null {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  try {
    new URL(raw);
    return raw;
  } catch {
    throw new Error("Cover image must be a valid URL");
  }
}

function parseStatus(value: FormDataEntryValue | null): "draft" | "published" {
  return value === "published" ? "published" : "draft";
}

function revalidatePost(slug?: string) {
  revalidatePath("/admin");
  revalidatePath("/blog");
  if (slug) revalidatePath(`/blog/${slug}`);
}

export async function createPost(formData: FormData): Promise<void> {
  const userId = await requireUserId();

  const title = String(formData.get("title") ?? "").trim();
  const body = sanitizePostBody(String(formData.get("body") ?? ""));
  if (!title) throw new Error("Title is required");
  if (!body) throw new Error("Body is required");

  const status = parseStatus(formData.get("status"));
  const slug = await uniqueSlug(
    String(formData.get("slug") ?? "").trim() || title
  );

  await db.orm.public.Post.create({
    title,
    slug,
    excerpt: String(formData.get("excerpt") ?? "").trim() || null,
    body,
    coverImageUrl: parseUrl(formData.get("coverImageUrl")),
    status,
    authorId: userId,
    publishedAt: status === "published" ? new Date().toISOString() : null,
  });

  revalidatePost(slug);
  redirect("/admin");
}

export async function updatePost(formData: FormData): Promise<void> {
  await requireUserId();

  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing post id");

  const existing = await db.orm.public.Post.first({ id });
  if (!existing) throw new Error("Post not found");

  const title = String(formData.get("title") ?? "").trim();
  const body = sanitizePostBody(String(formData.get("body") ?? ""));
  if (!title) throw new Error("Title is required");
  if (!body) throw new Error("Body is required");

  const status = parseStatus(formData.get("status"));
  const slug = await uniqueSlug(
    String(formData.get("slug") ?? "").trim() || title,
    id
  );

  // Set publishedAt when moving into published; keep the original stamp if it
  // was already published; clear it when moving back to draft.
  const publishedAt =
    status === "published"
      ? existing.publishedAt ?? new Date().toISOString()
      : null;

  await db.orm.public.Post.where({ id }).update({
    title,
    slug,
    excerpt: String(formData.get("excerpt") ?? "").trim() || null,
    body,
    coverImageUrl: parseUrl(formData.get("coverImageUrl")),
    status,
    publishedAt,
  });

  revalidatePost(slug);
  if (existing.slug !== slug) revalidatePath(`/blog/${existing.slug}`);
  redirect("/admin");
}

export async function deletePost(formData: FormData): Promise<void> {
  await requireUserId();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing post id");

  const existing = await db.orm.public.Post.select("slug").first({ id });
  await db.orm.public.Post.where({ id }).delete();

  revalidatePost(existing?.slug);
}

export async function deletePosts(ids: string[]): Promise<void> {
  await requireUserId();
  if (
    !Array.isArray(ids) ||
    ids.length === 0 ||
    !ids.every((id) => typeof id === "string" && id)
  ) {
    throw new Error("Missing post ids");
  }

  // `.delete()` removes a single row; `deleteAll()` removes every match and
  // returns the deleted rows so we can revalidate their pages.
  const deleted = await db.orm.public.Post
    .select("slug")
    .where((p) => p.id.in(ids))
    .deleteAll();

  revalidatePost();
  for (const { slug } of deleted) revalidatePath(`/blog/${slug}`);
}

export async function publishPost(formData: FormData): Promise<void> {
  await requireUserId();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing post id");

  const post = await db.orm.public.Post
    .select("slug", "publishedAt")
    .first({ id });
  if (!post) throw new Error("Post not found");

  await db.orm.public.Post.where({ id }).update({
    status: "published",
    publishedAt: post.publishedAt ?? new Date().toISOString(),
  });

  revalidatePost(post.slug);
}

export async function unpublishPost(formData: FormData): Promise<void> {
  await requireUserId();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing post id");

  const post = await db.orm.public.Post.select("slug").first({ id });
  await db.orm.public.Post.where({ id }).update({
    status: "draft",
    publishedAt: null,
  });

  revalidatePost(post?.slug);
}
