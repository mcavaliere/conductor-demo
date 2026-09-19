"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  deletePost,
  publishPost,
  unpublishPost,
} from "@/app/(admin)/admin/actions";
import type { Post } from "@/lib/posts";

export function PostRowActions({ post }: { post: Post }) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        size="sm"
        variant="ghost"
        nativeButton={false}
        render={<Link href={`/admin/${post.id}/edit`}>Edit</Link>}
      />

      <form action={post.status === "published" ? unpublishPost : publishPost}>
        <input type="hidden" name="id" value={post.id} />
        <Button size="sm" variant="ghost" type="submit">
          {post.status === "published" ? "Unpublish" : "Publish"}
        </Button>
      </form>

      <Dialog>
        <DialogTrigger
          render={
            <Button size="sm" variant="destructive">
              Delete
            </Button>
          }
        />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete post</DialogTitle>
            <DialogDescription>
              “{post.title}” will be permanently deleted. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <form action={deletePost}>
              <input type="hidden" name="id" value={post.id} />
              <Button variant="destructive" type="submit">
                Delete
              </Button>
            </form>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
