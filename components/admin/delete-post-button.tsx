"use client";

import { Button } from "@/components/ui/button";
import { deletePostAction } from "@/app/admin/posts/actions";

export function DeletePostButton({
  postId,
  postTitle,
}: {
  postId: string;
  postTitle: string;
}) {
  return (
    <form
      action={deletePostAction}
      onSubmit={(event) => {
        if (!window.confirm(`Delete "${postTitle}"? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={postId} />
      <Button size="sm" variant="destructive" type="submit">
        Delete
      </Button>
    </form>
  );
}
