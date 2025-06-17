import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@poc/button';
import { ThemeProvider, oceanTheme, forestTheme } from '@poc/themes';
import React from 'react';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    variant: { control: 'radio', options: ['primary', 'secondary'] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={oceanTheme}>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={oceanTheme}>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export const WithClickHandler: Story = {
  args: {
    variant: 'primary',
    children: 'Click me!',
    onClick: () => alert('Button clicked!'),
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={oceanTheme}>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    children: 'Disabled Button',
    disabled: true,
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={oceanTheme}>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export const WithForestTheme: Story = {
  args: {
    variant: 'primary',
    children: 'Forest Theme Button',
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={forestTheme}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem' }}>
          <Story />
          <Button variant="secondary">Forest Secondary</Button>
        </div>
      </ThemeProvider>
    ),
  ],
}; 