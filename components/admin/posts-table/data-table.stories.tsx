import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"
import { deletePosts } from "@/app/(admin)/admin/actions"
import type { Post } from "@/lib/posts"
import { PostsDataTable } from "./data-table"

const TITLES = [
  "Mango season",
  "Zebra crossings",
  "Kettle logic",
  "Apple harvest",
  "Night trains",
  "Orbit decay",
  "Lantern festival",
  "Quiet hours",
  "Basalt columns",
  "Ferns and moss",
  "Harbor lights",
  "Cedar smoke",
  "Violet dusk",
  "Tidal pools",
  "Juniper hill",
]

const posts: Post[] = TITLES.map((title, i) => {
  const day = String(28 - i).padStart(2, "0")
  const status = i % 3 === 2 ? "draft" : "published"
  const timestamp = new Date(`2026-09-${day}T12:00:00Z`)
  return {
    id: `post-${i + 1}`,
    title,
    slug: title.toLowerCase().replace(/\s+/g, "-"),
    excerpt: null,
    body: `<p>${title}</p>`,
    coverImageUrl: null,
    status,
    publishedAt: status === "published" ? timestamp : null,
    authorId: "user_1",
    createdAt: timestamp,
    updatedAt: timestamp,
  }
})

const meta = {
  component: PostsDataTable,
  tags: ["ai-generated"],
  args: { posts },
} satisfies Meta<typeof PostsDataTable>

export default meta
type Story = StoryObj<typeof meta>

/** Data rows only (skips the header row). */
function bodyRows(canvasElement: HTMLElement) {
  return Array.from(canvasElement.querySelectorAll("tbody tr"))
}

export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    await expect(bodyRows(canvasElement)).toHaveLength(10)
    await expect(canvas.getByText("Page 1 of 2")).toBeVisible()
  },
}

export const Paginates: Story = {
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Next" }))
    await expect(canvas.getByText("Page 2 of 2")).toBeVisible()
    await expect(bodyRows(canvasElement)).toHaveLength(5)
    await expect(canvas.getByRole("button", { name: "Next" })).toBeDisabled()
  },
}

export const SortsByTitle: Story = {
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole("button", { name: /title/i }))
    await expect(bodyRows(canvasElement)[0]).toHaveTextContent("Apple harvest")

    await userEvent.click(canvas.getByRole("button", { name: /title/i }))
    await expect(bodyRows(canvasElement)[0]).toHaveTextContent("Zebra crossings")
  },
}

export const FiltersByTitle: Story = {
  play: async ({ canvas, canvasElement }) => {
    await userEvent.type(canvas.getByPlaceholderText("Filter titles..."), "mango")
    const rows = bodyRows(canvasElement)
    await expect(rows).toHaveLength(1)
    await expect(rows[0]).toHaveTextContent("Mango season")
  },
}

export const FiltersByStatus: Story = {
  play: async ({ canvas, canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole("button", { name: /status/i }))
    await userEvent.click(await body.findByRole("menuitemcheckbox", { name: /draft/i }))
    await userEvent.keyboard("{Escape}")

    await waitFor(() => expect(bodyRows(canvasElement)).toHaveLength(5))
    for (const row of bodyRows(canvasElement)) {
      await expect(row).toHaveTextContent("draft")
    }
    await expect(canvas.getByRole("button", { name: "Reset" })).toBeVisible()
  },
}

export const BulkDeletesSelected: Story = {
  play: async ({ canvas, canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const rowBoxes = canvas.getAllByRole("checkbox", { name: "Select row" })
    await userEvent.click(rowBoxes[0])
    await userEvent.click(rowBoxes[1])
    await expect(canvas.getByText("2 of 15 row(s) selected.")).toBeVisible()

    await userEvent.click(canvas.getByRole("button", { name: "Delete selected (2)" }))
    const dialog = await body.findByRole("dialog")
    await userEvent.click(within(dialog).getByRole("button", { name: "Delete" }))

    await waitFor(() =>
      expect(deletePosts).toHaveBeenCalledWith(["post-1", "post-2"])
    )
  },
}
