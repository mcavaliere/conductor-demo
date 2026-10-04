import { db } from "@/src/prisma/db";

/** Convert arbitrary text into a URL-safe slug. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Produce a slug that is unique in the Post table. Starts from `base`
 * (slugified) and appends `-2`, `-3`, … until an unused slug is found.
 * `excludeId` lets an update keep its own slug without colliding with itself.
 */
export async function uniqueSlug(
  base: string,
  excludeId?: string
): Promise<string> {
  const root = slugify(base) || "post";
  let candidate = root;
  let n = 1;

  while (true) {
    const existing = await db.post.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!existing || existing.id === excludeId) return candidate;
    n += 1;
    candidate = `${root}-${n}`;
  }
}
