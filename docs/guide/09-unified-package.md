# Phase 8: Creating the Unified Components Package

This phase creates a unified `@poc/components` package that bundles all individual components and themes, enabling users to install the complete library with a single package.

## Why Create a Unified Package?

- **Simplified Installation**: Users can install `@poc/components @poc/themes` instead of multiple individual packages
- **Better Developer Experience**: Single import source for all components
- **Easier Version Management**: All components versioned together
- **Reduced Bundle Configuration**: Fewer dependencies to manage

## Step 1: Create the Unified Package Structure

**Important**: This assumes you already have individual component packages at the root level (e.g., `packages/button/`, `packages/input/`). The unified package should be a sibling, not a parent, of individual components.

```bash
# Create the unified package directory (if it doesn't exist)
mkdir -p packages/components/src

# Navigate to the components directory
cd packages/components
```

**Recommended Project Structure:**
```
packages/
├── components/          # ← Unified package (this is what we're creating)
├── button/              # ← Individual button package
├── input/               # ← Individual input package (future)
├── themes/              # ← Theme system
└── config/              # ← Shared configurations
    ├── tsconfig/
    └── eslint/
```

## Step 2: Initialize the Unified Package

Create `packages/components/package.json`:

```json
{
  "name": "@poc/components",
  "version": "0.0.0",
  "description": "Complete POC component library",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.esm.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.esm.js"
      },
      "require": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      }
    }
  },
  "files": [
    "dist",
    "README.md"
  ],
  "scripts": {
    "build": "tsc && vite build",
    "lint": "eslint src --max-warnings 0"
  },
  "keywords": [
    "react",
    "components",
    "ui",
    "design-system"
  ],
  "author": "",
  "license": "ISC",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/cavelasco/poc-component-library.git",
    "directory": "packages/components"
  },
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  },
  "dependencies": {
    "@poc/button": "workspace:*"
  },
  "devDependencies": {
    "@poc/tsconfig": "workspace:*",
    "@poc/eslint-config": "workspace:*",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.8.3",
    "vite": "^6.0.1",
    "vite-plugin-dts": "^4.5.4"
  },
  "peerDependencies": {
    "react": "^19.1.0"
  }
}
```

## Step 3: Configure TypeScript for the Unified Package

Create `packages/components/tsconfig.json`:

```json
{
  "extends": "@poc/tsconfig/react-library.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "dist",
    "node_modules",
    "**/*.stories.*",
    "**/*.test.*"
  ]
}
```

## Step 4: Configure ESLint for the Unified Package

Create `packages/components/eslint.config.js`:

```javascript
import config from "@poc/eslint-config/react-library.js";

export default [
  ...config,
  {
    ignores: ["dist/**", "node_modules/**", "*.config.js", "*.config.ts"],
  },
];
```

## Step 5: Configure Vite for Library Bundling

Create `packages/components/vite.config.ts`:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ["src/**/*"],
      exclude: ["**/*.stories.*", "**/*.test.*"]
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "POCComponents",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "esm" : format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
        },
      },
    },
  },
  resolve: {
    alias: {
      "@poc/button": resolve(__dirname, "../button/src"),
      // Future components will be added here:
      // "@poc/input": resolve(__dirname, "../input/src"),
    },
  },
});
```

## Step 6: Create the Main Export File

Create `packages/components/src/index.ts`:

```typescript
// Re-export all individual components
export * from '@poc/button';

// You can also create convenience exports
export { Button } from '@poc/button';
export type { ButtonProps } from '@poc/button';

// Future components will be added here:
// export * from '@poc/input';
// export * from '@poc/card';
// export * from '@poc/modal';
```

## Step 7: Create a README for the Unified Package

Create `packages/components/README.md`:

```markdown
# @poc/components

Complete component library for POC project.

## Installation

```bash
npm install @poc/components @poc/themes
```

## Usage

```tsx
import { Button } from '@poc/components';
import { ThemeProvider, atixTheme } from '@poc/themes';

function App() {
  return (
    <ThemeProvider theme={atixTheme}>
      <Button variant="primary">Hello World</Button>
    </ThemeProvider>
  );
}
```

## Components

- **Button**: Primary UI button component with theme integration

## Requirements

- React 19.1.0 or later
- @poc/themes for full theming functionality

## Development

This package is part of the POC component library monorepo.
```

## Step 8: Update Workspace Configuration

Ensure your `pnpm-workspace.yaml` includes the unified package:

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
  - "packages/config/*"
```

**Note**: With the flattened structure, the workspace configuration becomes much simpler. All packages (individual components, unified package, themes, config) are siblings under `packages/*`.

## Step 9: Update Turborepo Configuration

Your existing `turbo.json` should already handle this, but ensure it includes:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "lint": {},
    "dev": {
      "cache": false,
      "persistent": true
    },
    "storybook": {
      "cache": false,
      "persistent": true
    }
  }
}
```

## Step 10: Install Dependencies and Build

```bash
# From the root directory
cd ../..

# Install all dependencies
pnpm install

# Build the individual components first
pnpm --filter @poc/button build
pnpm --filter @poc/themes build

# Build the unified package
pnpm --filter @poc/components build

# Verify everything builds successfully
pnpm build
```

## Step 11: Update Documentation App to Use Unified Package

Update `apps/docs/package.json` to use the unified package:

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
    "@poc/components": "workspace:*",
    "@poc/themes": "workspace:*",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    // ... existing dev dependencies
  }
}
```

Update the Storybook alias in `apps/docs/.storybook/main.ts`:

```ts
async viteFinal(config) {
  const { mergeConfig } = await import("vite");
  return mergeConfig(config, {
    resolve: {
      alias: {
        "@poc/components": path.resolve(
          __dirname,
          "../../../packages/components/src/index.ts",
        ),
        "@poc/themes": path.resolve(
          __dirname,
          "../../../packages/themes/src/index.ts",
        ),
      },
    },
  });
},
```

Update your stories to use the unified package:

```tsx
// apps/docs/src/stories/Button.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@poc/components"; // Changed from @poc/button

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "radio", options: ["primary", "secondary"] },
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
```

## Step 12: Test the Unified Package

```bash
# Build and test everything
pnpm build

# Run Storybook to verify components work through the unified package
pnpm storybook

# Run linting
pnpm lint
```

## Step 13: Adding New Components to the Unified Package

When adding new components, follow this pattern:

### 1. Create the Individual Component Package

Example: `@poc/input`

### 2. Add it as a Dependency

In `packages/components/package.json`:

```json
{
  "dependencies": {
    "@poc/button": "workspace:*",
    "@poc/input": "workspace:*"
  }
}
```

### 3. Export it in the Main Index File

In `packages/components/src/index.ts`:

```typescript
export * from '@poc/button';
export * from '@poc/input';

// Convenience exports
export { Button } from '@poc/button';
export { Input } from '@poc/input';
export type { ButtonProps } from '@poc/button';
export type { InputProps } from '@poc/input';
```

### 4. Update the Vite Alias

In `packages/components/vite.config.ts`:

```typescript
resolve: {
  alias: {
    "@poc/button": resolve(__dirname, "../button/src"),
    "@poc/input": resolve(__dirname, "../input/src"),
    // Add more components here as you create them
  },
},
```

## Benefits of This Approach

- **Flexibility**: Users can still install individual components if needed
- **Convenience**: Single package installation for most users
- **Maintainability**: Each component is still developed independently
- **Tree Shaking**: Modern bundlers can still eliminate unused components
- **Incremental Adoption**: Easy to migrate existing individual installations

## Installation Options for Users

After implementing the unified package, users have multiple installation options:

### Option 1: Complete Library (Recommended)

```bash
npm install @poc/components @poc/themes
```

```tsx
import { Button } from '@poc/components';
import { ThemeProvider, atixTheme } from '@poc/themes';
```

### Option 2: Individual Components

```bash
npm install @poc/button @poc/themes
```

```tsx
import { Button } from '@poc/button';
import { ThemeProvider, atixTheme } from '@poc/themes';
```

### Option 3: Selective Installation

```bash
# Only install what you need
npm install @poc/button @poc/input @poc/themes
```

This gives users maximum flexibility while providing a convenient default option.

---

## Navigation

**[← Previous: Custom Themes](./08-custom-themes.md)** | **[Next: Publishing Strategy →](./10-publishing-strategy.md)** 