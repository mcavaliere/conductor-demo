import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"
import { Input } from "./input"

const meta = {
  component: Input,
  tags: ["ai-generated"],
  args: {
    placeholder: "Email",
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByPlaceholderText("Email")).toBeVisible()
  },
}

export const WithValue: Story = { args: { defaultValue: "hello@example.com" } }

export const Password: Story = { args: { type: "password", placeholder: "Password" } }

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByPlaceholderText("Email")).toBeDisabled()
  },
}
