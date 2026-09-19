import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "./card"
import { Button } from "./button"

const meta = {
  component: Card,
  tags: ["ai-generated"],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Project alpha</CardTitle>
        <CardDescription>Track progress and manage settings.</CardDescription>
        <CardAction>
          <Button size="sm" variant="outline">
            Edit
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>This card shows an example composition of the header, content, and footer slots.</p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Save</Button>
      </CardFooter>
    </Card>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Project alpha")).toBeVisible()
  },
}

export const Compact: Story = {
  args: { size: "sm" },
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Compact card</CardTitle>
        <CardDescription>Uses the smaller spacing variant.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Less padding between sections.</p>
      </CardContent>
    </Card>
  ),
}
