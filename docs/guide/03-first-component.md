# Phase 2: Building Our First Component (Button)

Now we create our first reusable component as its own package. **Important: Components will NOT contain their own stories - those will live in the docs app.**

## Step 1: Create the `button` Package

```bash
# Create the package directory (flattened structure)
mkdir -p packages/button/src

# Navigate into it
cd packages/button
```

## Step 2: Initialize `package.json`

Run `pnpm init`. Then, edit the generated `package.json` to look like this. **Pay close attention to the `type: "module"` field which is required for ESM compatibility:**

```json
{
  "name": "@poc/button",
  "version": "0.0.0",
  "description": "A simple button component",
  "type": "module",
  "main": "./dist/button.umd.js",
  "module": "./dist/button.es.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/button.es.js"
      },
      "require": {
        "types": "./dist/index.d.ts",
        "default": "./dist/button.umd.js"
      }
    },
    "./dist/button.css": "./dist/button.css"
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "vite build",
    "lint": "eslint src --max-warnings 0"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/cavelasco/poc-component-library.git",
    "directory": "packages/button"
  },
  "publishConfig": {
    "registry": "https://npm.pkg.github.com/"
  },
  "devDependencies": {
    "@poc/tsconfig": "workspace:*",
    "@poc/eslint-config": "workspace:*",
    "@vitejs/plugin-react": "^4.3.4",
    "vite": "^6.0.1",
    "vite-plugin-dts": "^3.0.0",
    "@types/react": "^19.1.0",
    "@types/node": "^20.1.0"
  },
  "peerDependencies": {
    "react": "^19.1.0"
  }
}
```

## Step 3: Install Dependencies

```bash
# Install React as a peer dependency, and dev dependencies
pnpm add react --save-peer
pnpm add -D typescript vite @vitejs/plugin-react vite-plugin-dts @types/react @types/node
```

## Step 4: Add Workspace Dependencies

Manually add the workspace dependencies to package.json, then run `pnpm install` from the root to link workspace packages.

## Step 5: Configure TypeScript for the `button` Package

Create `packages/button/tsconfig.json`. **Note: Use standalone config to avoid path resolution issues:**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "jsx": "react-jsx",
    "declaration": true,
    "declarationMap": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true,
    "lib": ["ES2022", "dom", "dom.iterable"],
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "strict": true
  },
  "include": ["src"],
  "exclude": ["dist", "build", "node_modules"]
}
```

## Step 6: Configure ESLint for the `button` Package

Create `packages/button/eslint.config.js`:

```javascript
import config from "@poc/eslint-config/react-library.js";

export default [
  ...config,
  {
    ignores: ["dist/**", "node_modules/**", "*.config.js", "*.config.ts"],
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      globals: {
        HTMLButtonElement: "readonly",
        HTMLElement: "readonly",
        React: "readonly",
      },
    },
  },
];
```

## Step 7: Configure Vite for Library Bundling

Create `packages/button/vite.config.ts`. **Note: Use relative path instead of path module to avoid import issues:**

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: "./src/index.ts",
      name: "Button",
      formats: ["es", "umd"],
      fileName: (format) => `button.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
```

## Step 8: Create the React Component

Create `packages/button/src/Button.tsx`:

```tsx
import React from "react";
import styles from "./Button.module.scss";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Is this the principal call to action on the page?
   */
  variant?: "primary" | "secondary";
  /**
   * Button contents
   */
  children: React.ReactNode;
}

/**
 * Primary UI component for user interaction
 */
export const Button = ({
  variant = "primary",
  children,
  className,
  ...props
}: ButtonProps) => {
  const variantClass =
    variant === "primary" ? styles.primary : styles.secondary;
  const combinedClassName = [styles.button, variantClass, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button type="button" className={combinedClassName} {...props}>
      {children}
    </button>
  );
};
```

## Step 9: Create Button Styles with Theme Integration

Create `packages/button/src/Button.module.scss`:

```scss
// Button base styles
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border: 1px solid transparent;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.5;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: 0 0 0 2px var(--color-primary-500, #3B82F6);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
}

// Primary variant - bold and prominent
.primary {
  background-color: var(--color-primary-500, #3B82F6);
  color: white;
  border: 1px solid var(--color-primary-500, #3B82F6);

  &:hover:not(:disabled) {
    background-color: var(--color-primary-600, #2563EB);
    border-color: var(--color-primary-600, #2563EB);
  }

  &:active:not(:disabled) {
    background-color: var(--color-primary-700, #1D4ED8);
    border-color: var(--color-primary-700, #1D4ED8);
  }
}

// Secondary variant - subtle and outlined
.secondary {
  background-color: transparent;
  color: var(--color-primary-500, #3B82F6);
  border: 1px solid var(--color-secondary-300, #D1D5DB);

  &:hover:not(:disabled) {
    background-color: var(--color-secondary-200, #F3F4F6);
    border-color: var(--color-secondary-400, #9CA3AF);
    color: var(--color-primary-600, #2563EB);
  }

  &:active:not(:disabled) {
    background-color: var(--color-secondary-300, #D1D5DB);
    border-color: var(--color-secondary-500, #6B7280);
    color: var(--color-primary-700, #1D4ED8);
  }
}
```

## Step 10: Create the Package Entry Point

Create `packages/button/src/index.ts` to export your component:

```typescript
export * from "./Button";
```

## Step 11: Test the Build and Lint

Go to the root of the monorepo (`cd ../../..`) and run:

```bash
# Test build
pnpm --filter @poc/button build
# OR using Turborepo
npx turbo build --filter=@poc/button

# Test linting
pnpm lint
```

You should see a new `dist` folder inside `packages/button` containing the bundled JS and type definition files, and no linting errors. Success!

## What We've Built

- ✅ **Standalone Component Package**: `@poc/button` can be installed independently
- ✅ **Theme Integration**: Uses CSS custom properties with fallback values
- ✅ **TypeScript Support**: Full type definitions and IntelliSense
- ✅ **Modern Build**: ESM + UMD builds with Vite
- ✅ **Proper Exports**: Works with both `import` and `require`

The Button component is now ready and will automatically pick up theme variables when used with the ThemeProvider, but works perfectly fine standalone with the fallback styles.

---

## Navigation

**[← Previous: Monorepo Setup](./02-monorepo-setup.md)** | **[Next: Storybook Setup →](./04-storybook-setup.md)** 