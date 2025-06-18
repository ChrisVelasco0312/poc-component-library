# Component Library Implementation Guide

This is a step-by-step guide to implementing a component library with theming. This guide will walk you through building a production-ready component library that supports theming and can be distributed as npm packages.

### Prerequisites

1.  **Node.js & pnpm:** Make sure you have Node.js (v18+) and pnpm installed. If not: `npm install -g pnpm`.
2.  **Git & GitHub Account:** You need a GitHub account and Git installed.
3.  **Code Editor:** VS Code or any other modern editor.
4.  **GitHub Scope:** Your "scope" will be your GitHub username or organization name. For this guide, we use the **`@poc`** scope which matches the actual project structure.

---

### **Phase 1: Setting Up the Monorepo Foundation**

This phase creates the skeleton of our project.

**Step 1: Initialize the Project**

```bash
# Create and enter the project directory
mkdir poc-component-library
cd poc-component-library

# Initialize a git repository (good practice)
git init

# Initialize pnpm
pnpm init

# Create the core directories for our packages and apps
mkdir -p packages apps
```

**Step 2: Create .gitignore (CRITICAL - Do this before committing!)**

Create a comprehensive `.gitignore` file in the root:

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Production builds
dist/
build/
*.tsbuildinfo

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Storybook build outputs
storybook-static/

# Editor directories and files
.vscode/
.idea/

# OS generated files
.DS_Store
Thumbs.db
```

**Step 3: Configure pnpm Workspaces**

Create a file named `pnpm-workspace.yaml` in the root of your project:

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
  - "packages/config/*"
  - "packages/components/*" # For component packages
```

**Step 4: Install and Configure Turborepo**

Turborepo will manage how we run tasks like `build` and `dev` across all our packages.

```bash
# Install Turborepo as a root-level dev dependency
pnpm add -D -w turborepo
```

Now, create a file named `turbo.json` in the root. **Note: Modern Turborepo uses `tasks` instead of `pipeline`:**

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

**Step 5: Update Root package.json**

Add required fields for modern Turborepo:

```json
{
  "name": "poc-component-library",
  "version": "1.0.0",
  "packageManager": "pnpm@9.0.0",
  "scripts": {
    "build": "npx turbo build",
    "dev": "npx turbo dev",
    "lint": "npx turbo lint",
    "storybook": "pnpm --filter docs storybook"
  },
  "devDependencies": {
    "turborepo": "0.0.1"
  }
}
```

**Step 6: Create Shared TypeScript and ESLint Configurations**

This is a key monorepo pattern. We define configs once and extend them in our packages.

1.  **Shared TypeScript Config:**

    ```bash
    # Create the directory for the shared tsconfig package
    mkdir -p packages/config/tsconfig
    cd packages/config/tsconfig
    pnpm init
    ```

    In `packages/config/tsconfig/package.json`, set the name to `@poc/tsconfig` and make it private.

    ```json
    {
      "name": "@poc/tsconfig",
      "version": "0.0.0",
      "private": true,
      "files": ["react-library.json"]
    }
    ```

    Now, create the actual TSConfig file `packages/config/tsconfig/react-library.json`:

    ```json
    {
      "$schema": "https://json.schemastore.org/tsconfig",
      "display": "React Library",
      "compilerOptions": {
        "composite": false,
        "declaration": true,
        "declarationMap": true,
        "esModuleInterop": true,
        "forceConsistentCasingInFileNames": true,
        "inlineSources": false,
        "isolatedModules": true,
        "jsx": "react-jsx",
        "lib": ["ES2022", "dom", "dom.iterable"],
        "module": "ESNext",
        "moduleResolution": "node",
        "noUnusedLocals": false,
        "noUnusedParameters": false,
        "preserveWatchOutput": true,
        "resolveJsonModule": true,
        "skipLibCheck": true,
        "strict": true,
        "target": "ES2022"
      }
    }
    ```

2.  **Shared ESLint Config:**

    ```bash
    # Create the directory for the shared ESLint package
    mkdir -p packages/config/eslint
    cd packages/config/eslint
    ```

    Create `packages/config/eslint/package.json`:

    ```json
    {
      "name": "@poc/eslint-config",
      "version": "0.0.0",
      "private": true,
      "type": "module",
      "files": ["react-library.js"],
      "dependencies": {
        "@eslint/js": "^9.0.0"
      }
    }
    ```

    Create `packages/config/eslint/react-library.js` (ESLint v9 flat config):

    ```javascript
    import js from "@eslint/js";
    import typescript from "@typescript-eslint/eslint-plugin";
    import typescriptParser from "@typescript-eslint/parser";
    import react from "eslint-plugin-react";
    import reactHooks from "eslint-plugin-react-hooks";

    export default [
      js.configs.recommended,
      {
        files: ["**/*.{js,jsx,ts,tsx}"],
        languageOptions: {
          ecmaVersion: "latest",
          sourceType: "module",
          parser: typescriptParser,
          parserOptions: {
            ecmaFeatures: { jsx: true },
          },
          globals: {
            console: "readonly",
            window: "readonly",
            document: "readonly",
            HTMLButtonElement: "readonly",
            HTMLElement: "readonly",
            React: "readonly",
          },
        },
        plugins: {
          "@typescript-eslint": typescript,
          react: react,
          "react-hooks": reactHooks,
        },
        rules: {
          ...typescript.configs.recommended.rules,
          ...react.configs.recommended.rules,
          ...reactHooks.configs.recommended.rules,
          "react/prop-types": "off",
          "@typescript-eslint/no-unused-vars": "warn",
          "react/react-in-jsx-scope": "off",
        },
        settings: {
          react: { version: "detect" },
        },
      },
    ];
    ```

3.  **Install ESLint dependencies at root:**

    ```bash
    cd ../../..
    pnpm add -D -w eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-react eslint-plugin-react-hooks @eslint/js
    ```

4.  **Go back to the root:** `cd ../../..` (from `packages/config/eslint`)

5.  **Root `tsconfig.json`:** Create a `tsconfig.json` in the project root to make VS Code happy.
    ```json
    {
      "compilerOptions": {
        "jsx": "react-jsx"
      }
    }
    ```

---

### **Phase 2: Building Our First Component (`Button`)**

Now we create our first reusable component as its own package. **Important: Components will NOT contain their own stories - those will live in the docs app.**

**Step 1: Create the `button` Package**

```bash
# Create the package directory
mkdir -p packages/components/button/src

# Navigate into it
cd packages/components/button
```

**Step 2: Initialize `package.json`**

Run `pnpm init`. Then, edit the generated `package.json` to look like this. **Pay close attention to the `type: "module"` field which is required for ESM compatibility:**

```json
// packages/components/button/package.json
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
    "directory": "packages/components/button"
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

**Step 3: Install Dependencies**

```bash
# Install React as a peer dependency, and dev dependencies
pnpm add react --save-peer
pnpm add -D typescript vite @vitejs/plugin-react vite-plugin-dts @types/react @types/node
```

**Step 4: Add Workspace Dependencies**

Manually add the workspace dependencies to package.json:

```json
{
  // ... other fields
  "devDependencies": {
    "@poc/tsconfig": "workspace:*",
    "@poc/eslint-config": "workspace:*",
    "@vitejs/plugin-react": "^4.3.4",
    "vite": "^6.0.1",
    "vite-plugin-dts": "^3.0.0",
    "@types/react": "^19.1.0",
    "@types/node": "^20.1.0"
  }
}
```

Then run `pnpm install` from the root to link workspace packages.

**Step 5: Configure TypeScript for the `button` Package**

Create `packages/components/button/tsconfig.json`. **Note: Use standalone config to avoid path resolution issues:**

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

**Step 6: Configure ESLint for the `button` Package**

Create `packages/components/button/eslint.config.js`:

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

**Step 7: Configure Vite for Library Bundling**

Create `packages/components/button/vite.config.ts`. **Note: Use relative path instead of path module to avoid import issues:**

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

**Step 8: Create the React Component**

Create `packages/components/button/src/Button.tsx`:

```tsx
import React from "react";

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
  ...props
}: ButtonProps) => {
  const mode =
    variant === "primary"
      ? "bg-blue-500 hover:bg-blue-700"
      : "bg-gray-500 hover:bg-gray-700";
  return (
    <button
      type="button"
      className={[
        "text-white",
        "font-bold",
        "py-2",
        "px-4",
        "rounded",
        mode,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
};
```

**Step 9: Create the Package Entry Point**

Create `packages/components/button/src/index.ts` to export your component:

```typescript
export * from "./Button";
```

**Step 10: Test the Build and Lint**

Go to the root of the monorepo (`cd ../../..`) and run:

```bash
# Test build
pnpm --filter @poc/button build
# OR using Turborepo
npx turbo build --filter=@poc/button

# Test linting
pnpm lint
```

You should see a new `dist` folder inside `packages/components/button` containing the bundled JS and type definition files, and no linting errors. Success!

---

### **Phase 3: Centralized Documentation with Storybook**

**This is where our approach differs from typical setups.** Instead of putting stories inside component packages, we'll create a centralized documentation app that imports and documents all components.

**Step 1: Create the `docs` App**

```bash
# From the root directory
mkdir apps/docs
cd apps/docs
```

**Step 2: Initialize Storybook**

Run the Storybook initializer:

```bash
npx storybook@latest init --yes
```

**Step 3: Clean Up Boilerplate**

Remove the Vite app boilerplate since we only need Storybook:

```bash
# Remove Vite-specific files
rm -rf src/App.* src/main.tsx src/index.css src/assets public/vite.svg index.html
```

**Step 4: Set Up Documentation Structure**

```bash
# Create stories directory
mkdir -p src/stories
```

**Step 5: Configure Package Dependencies**

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

**Step 6: Configure Storybook for Monorepo Hot-Reloading**

This is a **critical** step to ensure that when you edit a component in `packages/`, Storybook instantly updates.

1.  **Modify `apps/docs/.storybook/main.ts`**:
    We need to tell Vite to look at our component's _source code_, not its pre-compiled `dist` folder. We do this by creating a resolve alias.

    ```ts
    // apps/docs/.storybook/main.ts
    import type { StorybookConfig } from "@storybook/react-vite";
    import path from "path"; // Import path

    const config: StorybookConfig = {
      stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
      addons: [
        /* ... */
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
                "../../../packages/components/button/src/index.ts",
              ),
              // Add a new alias here for every new component
            },
          },
        });
      },
    };
    export default config;
    ```

2.  **Modify `apps/docs/.storybook/preview.ts`**:
    Ensure this file does **not** contain any direct CSS imports from component packages. Components are responsible for their own styles.

    ```ts
    // apps/docs/.storybook/preview.ts
    import type { Preview } from "@storybook/react-vite";

    const preview: Preview = {
      parameters: {
        /* ... */
      },
    };

    export default preview;
    ```

**Step 7: Create Documentation Content**

1. **Create Introduction Page** (`apps/docs/src/stories/Introduction.mdx`):

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
   ```

2. **Create Button Stories** (`apps/docs/src/stories/Button.stories.tsx`):

   ```tsx
   import type { Meta, StoryObj } from "@storybook/react-vite";
   import { Button } from "@poc/button";

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

**Step 8: Install Dependencies and Run Storybook**

```bash
# From root directory
cd ../..
pnpm install

# Run Storybook
pnpm storybook
```

Open `http://localhost:6006` in your browser. You should see your centralized component documentation with the Introduction page and Button component stories!

---

### **Phase 4: Setting Up the Documentation App**

This is where we'll use Storybook to see and test our components.

**Step 1: Create a Vite React App for Docs**

```bash
# From the root of the project
cd apps
# Create a React + TypeScript app using Vite
pnpm create vite docs --template react-ts
# Enter the new directory
cd docs
```

This will create a `docs` app with its own `package.json`.

**Step 2: Install Storybook**
Inside `apps/docs`, run the Storybook initializer:

```bash
npx storybook@latest init
```

When prompted, select `Vite` as the builder. This will install all necessary Storybook dependencies and create a `.storybook` directory.

**Step 3: Clean Up and Configure the Docs App**
Let's adjust the `docs` package to be a pure documentation app.

1.  **Modify `apps/docs/package.json`**:
    Add your `@poc/button` as a dependency. We also need `vite` and `globals` for our Storybook configuration.

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

    _Run `pnpm install` in the `docs` directory after saving._

2.  **Delete Unnecessary Files**:
    You can delete everything inside `apps/docs/src`. We will create our stories there.

**Step 4: Configure Storybook for Monorepo Hot-Reloading**

This is a **critical** step to ensure that when you edit a component in `packages/`, Storybook instantly updates.

1.  **Modify `apps/docs/.storybook/main.ts`**:
    We need to tell Vite to look at our component's _source code_, not its pre-compiled `dist` folder. We do this by creating a resolve alias.

    ```ts
    // apps/docs/.storybook/main.ts
    import type { StorybookConfig } from "@storybook/react-vite";
    import path from "path"; // Import path

    const config: StorybookConfig = {
      stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
      addons: [
        /* ... */
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
                "../../../packages/components/button/src/index.ts",
              ),
              // Add a new alias here for every new component
            },
          },
        });
      },
    };
    export default config;
    ```

2.  **Modify `apps/docs/.storybook/preview.ts`**:
    Ensure this file does **not** contain any direct CSS imports from component packages. Components are responsible for their own styles.

    ```ts
    // apps/docs/.storybook/preview.ts
    import type { Preview } from "@storybook/react-vite";

    const preview: Preview = {
      parameters: {
        /* ... */
      },
    };

    export default preview;
    ```

**Step 5: Create the Button Story**

Now let's create the actual story file to display our button.

Create `apps/docs/src/stories/Button.stories.tsx`:

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@poc/button";

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

_Note the import from `@storybook/react-vite`, which is required by the linter._

---

### **Phase 5: Running and Verifying**

This is the final test. Let's install and use our button in a brand new, separate project.

1.  **Create a test app outside your library project:**
    ```bash
    cd .. # Go up one level from your library folder
    npx create-next-app@latest test-consumer-app --ts --eslint --tailwind --app --src-dir --import-alias "@/*"
    cd test-consumer-app
    ```

### **Phase 6: Using Your Private Package**

This is the final test. Let's install and use our button in a brand new, separate project.

1.  **Create a test app outside your library project:**
    ```bash
    cd .. # Go up one level from your library folder
    npx create-next-app@latest test-consumer-app --ts --eslint --tailwind --app --src-dir --import-alias "@/*"
    cd test-consumer-app
    ```

---

## Theming System: Roadmap & Implementation

This section describes how to add theme support to the component library,
allowing style variables (such as color palettes) to be easily shared and
switched across all components.

### 1. Project Structure & Theme Definition

**a. Create a Theme System Directory**

- Add a new directory: `packages/themes/`
- Inside, create:
  - `default/` (for default themes)
  - `utils/` (for theme helpers, e.g., context, hooks)

**b. Define Theme Shape**

- Create a TypeScript interface for a theme (e.g., `Theme.ts`):
  ```ts
  export interface Theme {
    colors: {
      primary: string[];
      secondary: string[];
      tertiary: string[];
      success: string[];
      warning: string[];
      error: string[];
      info: string[];
      // ...other semantic colors
    };
    // Add typography, spacing, etc. as needed
  }
  ```

**c. Add Default Themes**

- In `packages/themes/default/`, create files like `atix.ts`, `banco-w.ts`, etc., each exporting a `Theme` object with color arrays as shown in the color palette example.

---

### 2. Theme Provider Implementation

**a. Create a Theme Context**

- In `packages/themes/utils/ThemeProvider.tsx`:
  - Create a React context for the theme.
  - Provide a `ThemeProvider` component that accepts a `theme` prop and makes it available via context.

**b. Create a Hook**

- Add `useTheme()` hook to access the current theme in any component.

**Example:**

```tsx
// ThemeProvider.tsx
import React, { createContext, useContext, useEffect } from 'react';
import { Theme } from '../Theme';

const ThemeContext = createContext<Theme | undefined>(undefined);

export const ThemeProvider: React.FC<{
  theme: Theme;
  children: React.ReactNode;
}> = ({ theme, children }) => {
  // Generate CSS variables from theme
  useEffect(() => {
    const root = document.documentElement;
    
    // Generate CSS variables for each color array
    Object.entries(theme.colors).forEach(([colorName, colorArray]) => {
      colorArray.forEach((color, index) => {
        const shade = index * 100; // 0, 100, 200, 300, etc.
        root.style.setProperty(`--color-${colorName}-${shade}`, color);
      });
    });
  }, [theme]);

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
};
```

---

### 3. Component Integration

Since this project uses SCSS modules, we'll generate CSS variables from the theme and inject them into the DOM.

**a. Update Components to Use CSS Variables in SCSS**

Refactor component SCSS modules to use the generated CSS variables.

```scss
// packages/components/button/src/Button.module.scss
.button {
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  &.primary {
    background-color: var(--color-primary-500);
    color: white;
    
    &:hover {
      background-color: var(--color-primary-600);
    }
    
    &:active {
      background-color: var(--color-primary-700);
    }
  }
  
  &.secondary {
    background-color: var(--color-secondary-200);
    color: var(--color-secondary-800);
    
    &:hover {
      background-color: var(--color-secondary-300);
    }
    
    &:active {
      background-color: var(--color-secondary-400);
    }
  }
}
```

**b. Update Component Implementation**

```tsx
// packages/components/button/src/Button.tsx
import React from 'react';
import styles from './Button.module.scss';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const Button = ({ variant = 'primary', children, className, ...props }: ButtonProps) => {
  const combinedClassName = [
    styles.button,
    styles[variant],
    className
  ].filter(Boolean).join(' ');
  
  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};
```

---

### 4. Applying and Switching Themes

**a. Usage in App**

- Wrap your app (or Storybook preview) with `ThemeProvider` and pass a theme:

  ```tsx
  import { ThemeProvider } from "@poc/themes/utils/ThemeProvider";
  import { atixTheme } from "@poc/themes/default/atix";

  <ThemeProvider theme={atixTheme}>
    <App />
  </ThemeProvider>;
  ```

**b. Switching Themes**

- Allow dynamic switching by updating the `theme` prop on `ThemeProvider` (e.g., via a dropdown).

---

### 5. Providing Default Themes

**a. Export Default Themes**

- Export all default themes from `@poc/themes` for easy import:
  ```ts
  export { atixTheme } from "./default/atix";
  export { bancoWTheme } from "./default/banco-w";
  // etc.
  ```

**b. Document Usage**

- In your docs, show how to import and use a default theme:

  ```tsx
  import { ThemeProvider, atixTheme } from "@poc/themes";

  <ThemeProvider theme={atixTheme}>...</ThemeProvider>;
  ```

---

### 6. Documentation & Storybook Integration

- Add a section in your docs for "Theming.
- Show how to use, switch, and extend themes.
- In Storybook, add a theme switcher (addon or custom toolbar) to preview components with different themes.

---

### Summary Table

| Step | Description                             | Outcome                         |
| ---- | --------------------------------------- | ------------------------------- |
| 1    | Define theme structure & default themes | Consistent theme objects        |
| 2    | Implement ThemeProvider & hook          | Easy theme access in components |
| 3    | Refactor components                     | Components use theme variables  |
| 4    | Apply/switch themes                     | Theming at app or story level   |
| 5    | Export/document default themes          | Easy adoption for users         |
| 6    | Update docs/Storybook                   | Clear usage and preview         |

---

## How to Use a Custom Theme in Your App

If you are using this component library in your own application and want to apply your own theme, follow these steps:

### 1. **Install the Library**

```bash
pnpm add @poc/button @poc/themes
# or
npm install @poc/button @poc/themes
```

### 2. **Create Your Theme Object in Your App**

In your application codebase (not in the library), define your theme object matching the `Theme` interface:

```ts
// src/theme/myTheme.ts
import type { Theme } from "@poc/themes";

export const myTheme: Theme = {
  colors: {
    primary: [
      "#001F3F",
      "#003366",
      "#00509E",
      "#0074D9",
      "#339CFF",
      "#66B2FF",
      "#99CCFF",
      "#CCE6FF",
    ],
    secondary: [
      "#FFDC00",
      "#FFE066",
      "#FFF3BF",
      "#FFF9E3",
      "#FFFBEA",
      "#FFFDF2",
      "#FFFFF8",
      "#FFFFFC",
    ],
    tertiary: [
      "#2ECC40",
      "#51D88A",
      "#A3E635",
      "#D9F99D",
      "#F0FDF4",
      "#F7FEE7",
      "#ECFDF5",
      "#F0FDF4",
    ],
    success: [
      "#28a745",
      "#51cf66",
      "#69db7c",
      "#b2f2bb",
      "#d3f9d8",
      "#e6fcf5",
      "#f8f9fa",
      "#f1f3f5",
    ],
    warning: [
      "#ffc107",
      "#ffe066",
      "#fff3bf",
      "#fff9db",
      "#fffbe6",
      "#fffdf2",
      "#fffef8",
      "#fffffc",
    ],
    error: [
      "#dc3545",
      "#ff6b6b",
      "#ffa8a8",
      "#ffe3e3",
      "#fff5f5",
      "#fff0f0",
      "#fff8f8",
      "#fffafa",
    ],
    info: [
      "#17a2b8",
      "#63e6be",
      "#a5d8ff",
      "#d0ebff",
      "#e3fafc",
      "#f1f3f5",
      "#f8f9fa",
      "#f1f3f5",
    ],
    // ...other color scales as needed
  },
  // Add other variables as needed (typography, spacing, etc.)
};
```

### 3. **Wrap Your App with the ThemeProvider**

In your app's root (e.g., `App.tsx` or `main.tsx`):

```tsx
import { ThemeProvider } from "@poc/themes";
import { myTheme } from "./theme/myTheme";

function App() {
  return (
    <ThemeProvider theme={myTheme}>
      {/* your app/components here */}
    </ThemeProvider>
  );
}

export default App;
```

### 4. **All Components Will Use Your Theme**

All components from the library that use the theme context will now automatically use your custom theme values.

---

### Notes for Custom Theme Implementation

- **You do NOT need to modify the library source.**
- **You do NOT need to add your theme to the library's `themes` folder.**
- You only need to match the `Theme` interface exported by the library.
- You can keep your theme file anywhere in your app codebase.

---

### Example Project Structure

```
my-app/
├── src/
│   ├── theme/
│   │   └── myTheme.ts
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── ...
```

---

### Tips for Custom Themes

- **Follow the structure:** Your theme object must match the `Theme` interface.
- **Color arrays:** Each color (primary, secondary, etc.) should be an array of shades, from darkest to lightest.
- **Extend as needed:** You can add more variables (typography, spacing, border radius, etc.) to the `Theme` interface.
- **Type safety:** TypeScript will help you catch any missing or misnamed fields.

---

## **Phase 7: Creating the Unified Components Package**

This phase creates a unified `@poc/components` package that bundles all individual components and themes, enabling users to install the complete library with a single package.

### **Why Create a Unified Package?**

- **Simplified Installation**: Users can install `@poc/components @poc/themes` instead of multiple individual packages
- **Better Developer Experience**: Single import source for all components
- **Easier Version Management**: All components versioned together
- **Reduced Bundle Configuration**: Fewer dependencies to manage

### **Step 1: Create the Unified Components Package Structure**

```bash
# Create the unified package directory
mkdir -p packages/components/src

# Navigate to the components directory
cd packages/components
```

### **Step 2: Initialize the Unified Package**

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

### **Step 3: Configure TypeScript for the Unified Package**

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

### **Step 4: Configure ESLint for the Unified Package**

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

### **Step 5: Configure Vite for Library Bundling**

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
    },
  },
});
```

### **Step 6: Create the Main Export File**

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

### **Step 7: Create a README for the Unified Package**

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

### **Step 8: Update Workspace Configuration**

Ensure your `pnpm-workspace.yaml` includes the unified package:

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
  - "packages/config/*"
  - "packages/components/*"
  - "packages/components" # Add this line for the unified package
```

### **Step 9: Update Turborepo Configuration**

Add the unified package to your `turbo.json`:

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

### **Step 10: Install Dependencies and Build**

```bash
# From the root directory
cd ../..

# Install all dependencies
pnpm install

# Build the individual components first
pnpm --filter @poc/button build

# Build the unified package
pnpm --filter @poc/components build

# Verify everything builds successfully
pnpm build
```

### **Step 11: Update Documentation App to Use Unified Package**

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

### **Step 12: Test the Unified Package**

```bash
# Build and test everything
pnpm build

# Run Storybook to verify components work through the unified package
pnpm storybook

# Run linting
pnpm lint
```

### **Step 13: Adding New Components to the Unified Package**

When adding new components, follow this pattern:

1. **Create the individual component package** (e.g., `@poc/input`)
2. **Add it as a dependency** in `packages/components/package.json`:
   ```json
   {
     "dependencies": {
       "@poc/button": "workspace:*",
       "@poc/input": "workspace:*"
     }
   }
   ```
3. **Export it** in `packages/components/src/index.ts`:
   ```typescript
   export * from '@poc/button';
   export * from '@poc/input';
   ```
4. **Update the Vite alias** in `packages/components/vite.config.ts`:
   ```typescript
   resolve: {
     alias: {
       "@poc/button": resolve(__dirname, "../button/src"),
       "@poc/input": resolve(__dirname, "../input/src"),
     },
   },
   ```

### **Benefits of This Approach**

- **Flexibility**: Users can still install individual components if needed
- **Convenience**: Single package installation for most users
- **Maintainability**: Each component is still developed independently
- **Tree Shaking**: Modern bundlers can still eliminate unused components
- **Incremental Adoption**: Easy to migrate existing individual installations

---

## **Publishing and Distribution Strategy**

This section covers the complete publishing workflow for your component library using GitHub as the primary distribution method, avoiding the npm registry.

### **Overview of the Publishing Strategy**

We'll use GitHub as our package registry, which provides:
- **Private/Public Control:** Keep your packages private or make them public
- **No npm Registry Dependency:** Avoid npm registry limitations and costs
- **GitHub Integration:** Seamless CI/CD with GitHub Actions
- **Access Control:** Use GitHub's robust permission system
- **Version Management:** Git tags for version control

### **Phase 1: Preparing for Publication**

#### **Step 1: Configure Package Registry Settings**

First, configure npm to use GitHub Package Registry for your scope:

**Create/Update `.npmrc` in your project root:**

```bash
# .npmrc
@poc:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
registry=https://registry.npmjs.org/
```

**Update each package's `package.json`:**

For each package in `packages/`, ensure the following configuration:

```json
{
  "name": "@poc/package-name",
  "version": "1.0.0",
  "description": "Your package description",
  "main": "dist/index.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist",
    "README.md"
  ],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/cavelasco/poc-component-library.git"
  },
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  },
  "private": false
}
```

#### **Step 2: Build Configuration for Publishing**

Ensure all packages have proper build configurations. Update your root `package.json`:

```json
{
  "scripts": {
    "build": "npx turbo build",
    "build:packages": "npx turbo build --filter='./packages/*'",
    "publish:prepare": "pnpm build:packages",
    "publish:all": "pnpm changeset publish",
    "version": "pnpm changeset version"
  }
}
```

#### **Step 3: Install and Configure Changesets**

Changesets will help manage versions and changelogs across the monorepo:

```bash
# Install changesets
pnpm add -D -w @changesets/cli @changesets/changelog-github

# Initialize changesets
pnpm changeset init
```

**Configure `.changeset/config.json`:**

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json",
  "changelog": [
    "@changesets/changelog-github",
         {
       "repo": "cavelasco/poc-component-library"
     }
  ],
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

### **Phase 2: Versioning Strategy**

#### **Semantic Versioning Plan**

We'll follow semantic versioning (semver) with the following strategy:

- **MAJOR (X.0.0):** Breaking changes that require consumer code updates
- **MINOR (0.X.0):** New features that are backward compatible
- **PATCH (0.0.X):** Bug fixes and small improvements

#### **Version Management Workflow**

**1. Creating a Changeset:**

When making changes, create a changeset to document them:

```bash
# Create a changeset for your changes
pnpm changeset

# Follow the prompts:
# - Select which packages are affected
# - Choose the type of change (major/minor/patch)
# - Write a summary of changes
```

**2. Version Bumping:**

```bash
# When ready to release, update versions
pnpm changeset version

# This will:
# - Update package.json versions
# - Update dependencies
# - Generate/update CHANGELOG.md files
# - Consume changeset files
```

**3. Git Workflow Integration:**

```bash
# After version bump, commit and tag
git add .
git commit -m "chore: release packages"
git push origin main

# Changesets will create appropriate git tags
# Format: @scope/package-name@version
```

#### **Branch Strategy for Releases**

- **main:** Stable, production-ready code
- **develop:** Integration branch for features
- **feature/*:** Individual feature branches
- **release/*:** Preparation branches for releases

```bash
# Example release workflow
git checkout -b release/v1.1.0
# Make final adjustments
pnpm changeset version
pnpm build:packages
git commit -m "chore: prepare release v1.1.0"
git checkout main
git merge release/v1.1.0
git push origin main
```

### **Phase 3: Publishing Process**

#### **Step 1: Manual Publishing Setup**

**Prerequisites:**
1. GitHub Personal Access Token with `packages:write` permission
2. Token stored as `GITHUB_TOKEN` environment variable

**Publishing Command Sequence:**

```bash
# 1. Ensure you're on main branch with latest changes
git checkout main
git pull origin main

# 2. Build all packages
pnpm publish:prepare

# 3. Authenticate with GitHub (if not already done)
echo "//npm.pkg.github.com/:_authToken=$GITHUB_TOKEN" >> ~/.npmrc

# 4. Publish all packages
pnpm changeset publish

# 5. Push tags to GitHub
git push --follow-tags
```

#### **Step 2: Automated Publishing with GitHub Actions**

Create `.github/workflows/publish.yml`:

```yaml
name: Publish Packages

on:
  push:
    branches:
      - main
  workflow_dispatch:

concurrency: ${{ github.workflow }}-${{ github.ref }}

jobs:
  publish:
    name: Publish to GitHub Package Registry
    runs-on: ubuntu-latest
    permissions:
      contents: write
      packages: write
      pull-requests: write
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          registry-url: 'https://npm.pkg.github.com'

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 9

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build packages
        run: pnpm build:packages

      - name: Create Release Pull Request or Publish
        id: changesets
        uses: changesets/action@v1
        with:
          publish: pnpm changeset publish
          title: "chore: release packages"
          commit: "chore: release packages"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

#### **Step 3: Pre-publish Validation**

Create a pre-publish script to validate packages:

**Create `scripts/validate-packages.js`:**

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const packagesDir = path.join(__dirname, '../packages');
const packages = fs.readdirSync(packagesDir);

let hasErrors = false;

packages.forEach(packageName => {
  const packagePath = path.join(packagesDir, packageName);
  const packageJsonPath = path.join(packagePath, 'package.json');
  const distPath = path.join(packagePath, 'dist');
  
  if (!fs.existsSync(packageJsonPath)) {
    console.error(`❌ Missing package.json in ${packageName}`);
    hasErrors = true;
    return;
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Check required fields
  const requiredFields = ['name', 'version', 'main', 'types'];
  requiredFields.forEach(field => {
    if (!packageJson[field]) {
      console.error(`❌ Missing ${field} in ${packageName}/package.json`);
      hasErrors = true;
    }
  });
  
  // Check if dist folder exists
  if (!fs.existsSync(distPath)) {
    console.error(`❌ Missing dist folder in ${packageName}`);
    hasErrors = true;
  }
  
  console.log(`✅ ${packageName} is valid`);
});

if (hasErrors) {
  console.error('\n❌ Validation failed. Please fix the errors above.');
  process.exit(1);
} else {
  console.log('\n✅ All packages are valid and ready for publishing!');
}
```

**Add to root `package.json`:**

```json
{
  "scripts": {
    "validate:packages": "node scripts/validate-packages.js",
    "publish:prepare": "pnpm validate:packages && pnpm build:packages"
  }
}
```

### **Phase 4: Installation and Usage Instructions**

#### **For New Projects Using Your Component Library**

**Step 1: Authentication Setup**

Users of your library need to authenticate with GitHub Package Registry:

```bash
# Create or update ~/.npmrc
echo "@poc:registry=https://npm.pkg.github.com" >> ~/.npmrc
echo "//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN" >> ~/.npmrc
```

**Alternative: Project-level authentication**

Create `.npmrc` in the consuming project:

```bash
# .npmrc in the consuming project
@poc:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

**Step 2: Installation Commands**

#### **Option A: Install Complete Library (Recommended)**

Install all packages for full functionality:

```bash
# Install complete component library (when unified package exists)
npm install @poc/components @poc/themes

# Or with pnpm
pnpm add @poc/components @poc/themes

# Or with yarn
yarn add @poc/components @poc/themes

# Current Reality: Install individual components
npm install @poc/button @poc/themes
```

#### **Option B: Install Individual Packages**

Install only what you need for more granular control:

```bash
# Install individual components (current structure)
npm install @poc/button

# Install only themes (for custom implementations)
npm install @poc/themes

# Install specific configuration packages
npm install @poc/tsconfig @poc/eslint-config

# Mix and match based on your needs
npm install @poc/button @poc/themes @poc/tsconfig
```

#### **Package Dependencies and Compatibility**

| Package | Dependencies | Use Case |
|---------|-------------|----------|
| `@poc/button` | None (peer deps: React, React-DOM) | Button component with theme integration |
| `@poc/themes` | React (peer dependency) | Theme definitions and ThemeProvider |
| `@poc/tsconfig` | None | TypeScript configuration |
| `@poc/eslint-config` | ESLint plugins | Linting configuration |

**Important Notes:**
- **Components package** works standalone but requires a theme context for full functionality
- **Themes package** can be used independently for custom component implementations
- **Configuration packages** are optional development dependencies

**Step 3: Basic Setup in a React Project**

**Create a basic setup file `src/lib/components.ts`:**

```typescript
// src/lib/components.ts
import { ThemeProvider } from '@poc/themes';
import { atixTheme } from '@poc/themes';

// Re-export components for easier imports
export * from '@poc/button';
export { ThemeProvider, atixTheme };
```

**Update your main App component:**

```tsx
// src/App.tsx
import React from 'react';
import { ThemeProvider, atixTheme, Button } from './lib/components';

function App() {
  return (
    <ThemeProvider theme={atixTheme}>
      <div className="App">
        <h1>My App with Component Library</h1>
        <Button variant="primary">
          Hello from Component Library!
        </Button>
      </div>
    </ThemeProvider>
  );
}

export default App;
```

#### **Advanced Installation Scenarios**

**For TypeScript Projects:**

Ensure TypeScript can resolve types by adding to `tsconfig.json`:

```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "skipLibCheck": true
  }
}
```

**For Next.js Projects:**

Add to `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@poc/components',
    '@poc/themes'
  ],
  experimental: {
    externalDir: true
  }
};

module.exports = nextConfig;
```

**For Vite Projects:**

No additional configuration needed, but ensure you have the latest Vite version:

```bash
npm update vite @vitejs/plugin-react
```

#### **Usage Examples and Patterns**

**1. Complete Library Usage (Components + Themes):**

```tsx
import { Button } from '@poc/button';
import { ThemeProvider, atixTheme } from '@poc/themes';

function MyApp() {
  return (
    <ThemeProvider theme={atixTheme}>
      <div>
        <Button variant="primary">Submit</Button>
      </div>
    </ThemeProvider>
  );
}
```

**2. Components Only (Custom Theme Implementation):**

If you only install `@poc/button` and want to implement your own theming:

```tsx
import { Button } from '@poc/button';
import { createTheme, ThemeProvider } from '@mui/material/styles'; // Example with MUI

const customTheme = createTheme({
  // Your custom theme configuration
});

function MyApp() {
  return (
    <ThemeProvider theme={customTheme}>
      <div>
        <Button variant="primary">Submit</Button>
      </div>
    </ThemeProvider>
  );
}
```

**3. Themes Only (Custom Components):**

If you only install `@poc/themes` to use with your own components:

```tsx
import { ThemeProvider, atixTheme, useTheme } from '@poc/themes';

// Your custom component using the theme
function CustomButton({ children, ...props }) {
  const theme = useTheme();
  
  return (
    <button 
      style={{ 
        backgroundColor: theme.colors.primary[3],
        color: theme.colors.primary[0]
      }}
      {...props}
    >
      {children}
    </button>
  );
}

function App() {
  return (
    <ThemeProvider theme={atixTheme}>
      <CustomButton>My Custom Button</CustomButton>
    </ThemeProvider>
  );
}
```

**4. Dynamic Theme Switching:**

```tsx
import { useState } from 'react';
import { ThemeProvider, atixTheme, bancoWTheme } from '@poc/themes';
import { Button } from '@poc/button';

function App() {
  const [currentTheme, setCurrentTheme] = useState(atixTheme);

  const toggleTheme = () => {
    setCurrentTheme(prev => prev === atixTheme ? bancoWTheme : atixTheme);
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <Button onClick={toggleTheme}>
        Switch Theme
      </Button>
      {/* Your app components */}
    </ThemeProvider>
  );
}
```

#### **Installation Strategy Decision Guide**

Choose your installation approach based on your project needs:

| Scenario | Recommended Installation | Reason |
|----------|-------------------------|---------|
| **New project starting from scratch** | Complete library (`@poc/button @poc/themes`) | Full functionality, consistent theming |
| **Existing project with established design system** | Components only (`@poc/button`) | Integrate with existing theme system |
| **Building custom components with library themes** | Themes only (`@poc/themes`) | Reuse theme system, custom component implementation |
| **Large project with selective usage** | Individual packages as needed | Minimize bundle size, use only required features |
| **Development/build tooling** | Config packages (`@poc/tsconfig @poc/eslint-config`) | Consistent development experience |

#### **Migration Paths Between Installation Options**

**From Components-Only to Complete Library:**

```bash
# Add themes package
npm install @poc/themes

# Update your imports
- import { createTheme } from './utils/theme';
+ import { ThemeProvider, atixTheme } from '@poc/themes';
```

**From Complete Library to Components-Only:**

```bash
# Remove themes package
npm uninstall @poc/themes

# Implement custom theming
+ import { createTheme } from './utils/theme';
- import { ThemeProvider, atixTheme } from '@poc/themes';
```

### **Phase 5: Maintenance and Updates**

#### **Updating the Library**

**For Library Maintainers:**

```bash
# 1. Make your changes
git checkout -b feature/new-component

# 2. Create changeset when ready
pnpm changeset

# 3. Commit and push
git commit -m "feat: add new component"
git push origin feature/new-component

# 4. Create PR and merge to main
# 5. Automated publishing will handle the rest
```

**For Library Consumers:**

```bash
# Check for updates
npm outdated @poc/button @poc/themes

# Update to latest versions
npm update @poc/button @poc/themes

# Or update to specific version
npm install @poc/button@1.2.0
```

#### **Breaking Changes Management**

**Communicating Breaking Changes:**

1. **Changelog:** Maintain detailed CHANGELOG.md files
2. **Migration Guides:** Create migration documentation for major versions
3. **Deprecation Warnings:** Add deprecation warnings before removing features
4. **Version Support:** Maintain support for previous major version

**Example Migration Guide Structure:**

```markdown
# Migration Guide: v2.0.0

## Breaking Changes

### Button Component
- `size` prop renamed to `variant`
- `color` prop removed, use `intent` instead

### Before (v1.x)
```tsx
<Button size="large" color="blue">Click me</Button>
```

### After (v2.x)
```tsx
<Button variant="large" intent="primary">Click me</Button>
```

## Automated Migration
Run our codemod to automatically update your code:
```bash
npx @poc/codemod v1-to-v2 src/
```
```

### **Publishing Checklist**

Before each release, ensure:

- [ ] All tests pass
- [ ] Documentation is updated
- [ ] Changesets are created for all changes
- [ ] Build artifacts are generated successfully
- [ ] Version numbers follow semver
- [ ] Breaking changes are documented
- [ ] CI/CD pipeline completes successfully
- [ ] GitHub release notes are prepared

### **Troubleshooting Publishing Issues**

**Common Issues and Solutions:**

1. **Authentication Failures:**
   ```bash
   # Verify token has correct permissions
   npm whoami --registry=https://npm.pkg.github.com
   ```

2. **Package Not Found:**
   ```bash
   # Check if package is public
   # Verify package name and scope
   # Ensure user has access to the repository
   ```

3. **Version Conflicts:**
   ```bash
   # Check existing versions
   npm view @poc/button versions --json
   ```

4. **Build Failures:**
   ```bash
   # Clean and rebuild
   pnpm clean
   pnpm install
   pnpm build:packages
   ```

This comprehensive publishing strategy ensures reliable, automated distribution of your component library while maintaining version control and providing clear installation instructions for consumers.
