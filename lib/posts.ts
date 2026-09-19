import type { ResultType } from "@prisma/orm-postgres/components/runtime";
import { db } from "@/src/prisma/db";

/** A Post row (scalar fields only). */
export type Post = ResultType<typeof db.orm.public.Post>;

/** Published posts, newest first. Used by the public blog index. */
export async function getPublishedPosts(): Promise<Post[]> {
  return db.orm.public.Post.where({ status: "published" })
    .orderBy((p) => p.publishedAt.desc())
    .all();
}

/** A single published post by slug, or null. Drafts return null. */
export async function getPublishedPostBySlug(slug: string): Promise<Post | null> {
  return db.orm.public.Post.where((p) => p.slug.eq(slug))
    .where((p) => p.status.eq("published"))
    .first();
}

/** Every post (any status), newest first. Used by the admin dashboard. */
export async function getAllPosts(): Promise<Post[]> {
  return db.orm.public.Post.orderBy((p) => p.createdAt.desc()).all();
}

/** A single post by id, or null. Used by the admin editor. */
export async function getPostById(id: string): Promise<Post | null> {
  return db.orm.public.Post.first({ id });
}
