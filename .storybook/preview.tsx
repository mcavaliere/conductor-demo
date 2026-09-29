import type { Preview } from '@storybook/nextjs-vite'
import { sb } from 'storybook/test'
import '../app/globals.css'
import './fonts.css'

sb.mock(import('../app/(admin)/admin/actions.ts'))

const preview: Preview = {
  decorators: [
    (Story) => (
      <div className="font-sans antialiased">
        <Story />
      </div>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
};

export default preview;