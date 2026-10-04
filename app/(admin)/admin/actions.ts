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

  await db.post.create({
    data: {
      title,
      slug,
      excerpt: String(formData.get("excerpt") ?? "").trim() || null,
      body,
      coverImageUrl: parseUrl(formData.get("coverImageUrl")),
      status,
      authorId: userId,
      publishedAt: status === "published" ? new Date() : null,
    },
  });

  revalidatePost(slug);
  redirect("/admin");
}

export async function updatePost(formData: FormData): Promise<void> {
  await requireUserId();

  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing post id");

  const existing = await db.post.findUnique({ where: { id } });
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
    status === "published" ? existing.publishedAt ?? new Date() : null;

  await db.post.update({
    where: { id },
    data: {
      title,
      slug,
      excerpt: String(formData.get("excerpt") ?? "").trim() || null,
      body,
      coverImageUrl: parseUrl(formData.get("coverImageUrl")),
      status,
      publishedAt,
    },
  });

  revalidatePost(slug);
  if (existing.slug !== slug) revalidatePath(`/blog/${existing.slug}`);
  redirect("/admin");
}

export async function deletePost(formData: FormData): Promise<void> {
  await requireUserId();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing post id");

  const existing = await db.post.findUnique({ where: { id }, select: { slug: true } });
  if (!existing) return;
  await db.post.delete({ where: { id } });

  revalidatePost(existing.slug);
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

  const [deleted] = await db.$transaction([
    db.post.findMany({ where: { id: { in: ids } }, select: { slug: true } }),
    db.post.deleteMany({ where: { id: { in: ids } } }),
  ]);

  revalidatePost();
  for (const { slug } of deleted) revalidatePath(`/blog/${slug}`);
}

export async function publishPost(formData: FormData): Promise<void> {
  await requireUserId();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing post id");

  const post = await db.post.findUnique({
    where: { id },
    select: { slug: true, publishedAt: true },
  });
  if (!post) throw new Error("Post not found");

  await db.post.update({
    where: { id },
    data: { status: "published", publishedAt: post.publishedAt ?? new Date() },
  });

  revalidatePost(post.slug);
}

export async function unpublishPost(formData: FormData): Promise<void> {
  await requireUserId();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing post id");

  const post = await db.post.findUnique({ where: { id }, select: { slug: true } });
  if (!post) return;
  await db.post.update({ where: { id }, data: { status: "draft", publishedAt: null } });

  revalidatePost(post.slug);
}
