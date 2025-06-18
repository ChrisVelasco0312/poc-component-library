# Phase 3: Centralized Documentation with Storybook

**This is where our approach differs from typical setups.** Instead of putting stories inside component packages, we'll create a centralized documentation app that imports and documents all components.

## Why Centralized Documentation?

- **Separation of Concerns**: Components focus on functionality, docs focus on documentation
- **Better Organization**: All documentation in one place
- **Easier Maintenance**: Consistent documentation patterns across all components
- **Single Source of Truth**: One place to learn about all components

## Step 1: Create the `docs` App

```bash
# From the root directory
mkdir apps/docs
cd apps/docs
```

## Step 2: Initialize Storybook

Run the Storybook initializer:

```bash
npx storybook@latest init --yes
```

When prompted, select `Vite` as the builder.

## Step 3: Clean Up Boilerplate

Remove the Vite app boilerplate since we only need Storybook:

```bash
# Remove Vite-specific files
rm -rf src/App.* src/main.tsx src/index.css src/assets public/vite.svg index.html
```

## Step 4: Set Up Documentation Structure

```bash
# Create stories directory
mkdir -p src/stories
```

## Step 5: Configure Package Dependencies

Edit `apps/docs/package.json` to include your component packages and clean up unnecessary scripts:

```json
{
  "name": "docs",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  },
  "dependencies": {
    "@poc/button": "workspace:*",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@storybook/react": "^8.1.1",
    "@storybook/react-vite": "^8.1.1",
    "storybook": "^8.1.1",
    "@types/react": "^19.1.0",
    "@types/react-dom": "^19.1.0",
    "typescript": "^5.2.2",
    "vite": "^5.0.8",
    "globals": "^15.9.0"
  }
}
```

## Step 6: Configure Storybook for Monorepo Hot-Reloading

This is a **critical** step to ensure that when you edit a component in `packages/`, Storybook instantly updates.

### Modify `apps/docs/.storybook/main.ts`

We need to tell Vite to look at our component's _source code_, not its pre-compiled `dist` folder:

```ts
import type { StorybookConfig } from "@storybook/react-vite";
import path from "path"; // Import path

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  // Add this viteFinal config
  async viteFinal(config) {
    const { mergeConfig } = await import("vite");
    return mergeConfig(config, {
      resolve: {
        alias: {
          "@poc/button": path.resolve(
            __dirname,
            "../../../packages/button/src/index.ts",
          ),
          // Add a new alias here for every new component
          // "@poc/input": path.resolve(
          //   __dirname,
          //   "../../../packages/input/src/index.ts",
          // ),
        },
      },
    });
  },
};
export default config;
```

### Modify `apps/docs/.storybook/preview.ts`

Ensure this file does **not** contain any direct CSS imports from component packages:

```ts
import type { Preview } from "@storybook/react-vite";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
```

## Step 7: Create Documentation Content

### Create Introduction Page

Create `apps/docs/src/stories/Introduction.mdx`:

```mdx
import { Meta } from "@storybook/blocks";

<Meta title="POC Component Library/Introduction" />

# POC Component Library

Welcome to our component library documentation! This demonstrates a centralized approach to component documentation where all stories live in a dedicated docs app.

## Architecture Benefits

- **Separation of Concerns**: Components focus on functionality
- **Centralized Maintenance**: All documentation in one place
- **Better Organization**: Consistent documentation patterns
- **Easier Onboarding**: Single location for all component examples

## Getting Started

Browse the components in the sidebar to see examples and documentation for each component.

## Component Architecture

Each component is:
- ✅ **Theme-aware**: Automatically picks up theme variables
- ✅ **Standalone**: Works without themes using fallback styles
- ✅ **TypeScript**: Full type safety and IntelliSense
- ✅ **Accessible**: Built with accessibility in mind
```

### Create Button Stories

Create `apps/docs/src/stories/Button.stories.tsx`:

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@poc/button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  parameters: { 
    layout: "centered",
    docs: {
      description: {
        component: "A versatile button component with theme integration and multiple variants."
      }
    }
  },
  tags: ["autodocs"],
  argTypes: {
    variant: { 
      control: "radio", 
      options: ["primary", "secondary"],
      description: "Visual style variant of the button"
    },
    children: {
      description: "Button label or content"
    },
    disabled: {
      control: "boolean",
      description: "Whether the button is disabled"
    }
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Primary Button",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary Button",
  },
};

export const Disabled: Story = {
  args: {
    variant: "primary",
    children: "Disabled Button",
    disabled: true,
  },
};

export const CustomContent: Story = {
  args: {
    variant: "primary",
    children: (
      <>
        🚀 Custom Content
      </>
    ),
  },
};
```

## Step 8: Install Dependencies and Run Storybook

```bash
# From root directory
cd ../..
pnpm install

# Run Storybook
pnpm storybook
```

Open `http://localhost:6006` in your browser. You should see your centralized component documentation with:
- Introduction page
- Button component with multiple stories
- Auto-generated documentation from your TypeScript types

## Benefits of This Setup

- ✅ **Hot Reloading**: Edit components and see changes instantly in Storybook
- ✅ **Centralized Documentation**: All component examples in one place
- ✅ **Auto-generated Docs**: TypeScript interfaces become documentation
- ✅ **Interactive Examples**: Users can play with component props
- ✅ **Consistent Patterns**: Same documentation structure for all components

---

## Navigation

**[← Previous: First Component](./03-first-component.md)** | **[Next: Documentation App →](./05-documentation-app.md)** 