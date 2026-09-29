"use client";

import { useState, useTransition } from "react";
import type { Table } from "@tanstack/react-table";
import { ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deletePosts } from "@/app/(admin)/admin/actions";
import type { Post } from "@/lib/posts";

const STATUSES: Post["status"][] = ["draft", "published"];

export function PostsTableToolbar({ table }: { table: Table<Post> }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const titleColumn = table.getColumn("title");
  const statusColumn = table.getColumn("status");
  const statusFilter = (statusColumn?.getFilterValue() as string[]) ?? [];
  const isFiltered = table.getState().columnFilters.length > 0;
  const selectedIds = table.getSelectedRowModel().rows.map((row) => row.id);

  function toggleStatus(status: string, checked: boolean) {
    const next = checked
      ? [...statusFilter, status]
      : statusFilter.filter((s) => s !== status);
    statusColumn?.setFilterValue(next.length ? next : undefined);
  }

  function confirmDelete() {
    startTransition(async () => {
      await deletePosts(selectedIds);
      table.resetRowSelection();
      setConfirmOpen(false);
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        placeholder="Filter titles..."
        value={(titleColumn?.getFilterValue() as string) ?? ""}
        onChange={(e) => titleColumn?.setFilterValue(e.target.value)}
        className="h-8 w-full max-w-xs"
      />

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" size="sm">
              <ListFilter />
              Status
              {statusFilter.length > 0 && ` (${statusFilter.length})`}
            </Button>
          }
        />
        <DropdownMenuContent className="w-40">
          {STATUSES.map((status) => (
            <DropdownMenuCheckboxItem
              key={status}
              checked={statusFilter.includes(status)}
              onCheckedChange={(checked) => toggleStatus(status, checked)}
              className="capitalize"
            >
              {status}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {isFiltered && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => table.resetColumnFilters()}
        >
          Reset
        </Button>
      )}

      {selectedIds.length > 0 && (
        <Button
          variant="destructive"
          size="sm"
          className="ml-auto"
          onClick={() => setConfirmOpen(true)}
        >
          Delete selected ({selectedIds.length})
        </Button>
      )}

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {selectedIds.length} post(s)</DialogTitle>
            <DialogDescription>
              The selected posts will be permanently deleted. This cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={pending}
            >
              {pending ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
