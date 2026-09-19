import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"
import { Label } from "./label"
import { Input } from "./input"

const meta = {
  component: Label,
  tags: ["ai-generated"],
  args: {
    children: "Email address",
  },
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Email address")).toBeVisible()
  },
}

export const WithInput: Story = {
  render: (args) => (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="email" {...args} />
      <Input id="email" placeholder="you@example.com" />
    </div>
  ),
}
