import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"
import { Button } from "./button"

const meta = {
  component: Button,
  tags: ["ai-generated"],
  args: {
    children: "Button",
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Button" })).toBeVisible()
  },
}

export const Outline: Story = { args: { variant: "outline" } }
export const Secondary: Story = { args: { variant: "secondary" } }
export const Ghost: Story = { args: { variant: "ghost" } }
export const Destructive: Story = { args: { variant: "destructive" } }
export const Link: Story = { args: { variant: "link" } }

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Button" })).toBeDisabled()
  },
}

export const CssCheck: Story = {
  play: async ({ canvas }) => {
    const button = canvas.getByRole("button", { name: "Button" })
    // default variant/size uses rounded-lg -> --radius-lg (0.625rem = 10px); fails if Tailwind/global CSS did not load.
    await expect(getComputedStyle(button).borderRadius).toBe("10px")
  },
}
