import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import EditIntakeWorkbench from './EditIntakeWorkbench';

const meta = {
  component: EditIntakeWorkbench,
  tags: ['ai-generated']
} satisfies Meta<typeof EditIntakeWorkbench>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Workbench: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Public edit intake')).toBeVisible();
    await expect(canvas.getByText('Generated intake JSON')).toBeVisible();
  }
};
