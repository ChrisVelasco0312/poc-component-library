### Prerequisites

1.  **Node.js & pnpm:** Make sure you have Node.js (v18+) and pnpm installed. If not: `npm install -g pnpm`.
2.  **Git & GitHub Account:** You need a GitHub account and Git installed.
3.  **Code Editor:** VS Code or any other modern editor.
4.  **GitHub Scope:** Your "scope" will be your GitHub username or organization name. For this guide, I will use the placeholder **`@your-scope`**. **You must replace this everywhere it appears.**

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
  - 'apps/*'
  - 'packages/*'
  - 'packages/config/*'
  - 'packages/components/*' # For component packages
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
    In `packages/config/tsconfig/package.json`, set the name to `@your-scope/tsconfig` and make it private.
    ```json
    {
      "name": "@your-scope/tsconfig",
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
      "name": "@your-scope/eslint-config",
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
    import js from '@eslint/js';
    import typescript from '@typescript-eslint/eslint-plugin';
    import typescriptParser from '@typescript-eslint/parser';
    import react from 'eslint-plugin-react';
    import reactHooks from 'eslint-plugin-react-hooks';

    export default [
      js.configs.recommended,
      {
        files: ['**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
          ecmaVersion: 'latest',
          sourceType: 'module',
          parser: typescriptParser,
          parserOptions: {
            ecmaFeatures: { jsx: true },
          },
          globals: {
            console: 'readonly',
            window: 'readonly',
            document: 'readonly',
            HTMLButtonElement: 'readonly',
            HTMLElement: 'readonly',
            React: 'readonly',
          },
        },
        plugins: {
          '@typescript-eslint': typescript,
          react: react,
          'react-hooks': reactHooks,
        },
        rules: {
          ...typescript.configs.recommended.rules,
          ...react.configs.recommended.rules,
          ...reactHooks.configs.recommended.rules,
          'react/prop-types': 'off',
          '@typescript-eslint/no-unused-vars': 'warn',
          'react/react-in-jsx-scope': 'off',
        },
        settings: {
          react: { version: 'detect' },
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
  "name": "@your-scope/button",
  "version": "0.0.0",
  "description": "A simple button component",
  "type": "module",
  "main": "./dist/button.umd.js",
  "module": "./dist/button.es.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/button.es.js",
      "require": "./dist/button.umd.js"
    }
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
  "publishConfig": {
    "access": "restricted"
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
    "@your-scope/tsconfig": "workspace:*",
    "@your-scope/eslint-config": "workspace:*",
    // ... other dependencies
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
import config from '@your-scope/eslint-config/react-library.js';

export default [
  ...config,
  {
    ignores: ['dist/**', 'node_modules/**', '*.config.js', '*.config.ts'],
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        HTMLButtonElement: 'readonly',
        HTMLElement: 'readonly',
        React: 'readonly',
      },
    },
  },
];
```

**Step 7: Configure Vite for Library Bundling**

Create `packages/components/button/vite.config.ts`. **Note: Use relative path instead of path module to avoid import issues:**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'Button',
      formats: ['es', 'umd'],
      fileName: (format) => `button.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});
```

**Step 8: Create the React Component**

Create `packages/components/button/src/Button.tsx`:

```tsx
import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Is this the principal call to action on the page?
   */
  variant?: 'primary' | 'secondary';
  /**
   * Button contents
   */
  children: React.ReactNode;
}

/**
 * Primary UI component for user interaction
 */
export const Button = ({ variant = 'primary', children, ...props }: ButtonProps) => {
  const mode = variant === 'primary' ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-500 hover:bg-gray-700';
  return (
    <button
      type="button"
      className={['text-white', 'font-bold', 'py-2', 'px-4', 'rounded', mode].join(' ')}
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
export * from './Button';
```

**Step 10: Test the Build and Lint**

Go to the root of the monorepo (`cd ../../..`) and run:

```bash
# Test build
pnpm --filter @your-scope/button build
# OR using Turborepo
npx turbo build --filter=@your-scope/button

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
    "@your-scope/button": "workspace:*",
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
    We need to tell Vite to look at our component's *source code*, not its pre-compiled `dist` folder. We do this by creating a resolve alias.

    ```ts
    // apps/docs/.storybook/main.ts
    import type { StorybookConfig } from '@storybook/react-vite';
    import path from 'path'; // Import path

    const config: StorybookConfig = {
      stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
      addons: [/* ... */],
      framework: {
        name: '@storybook/react-vite',
        options: {},
      },
      // Add this viteFinal config
      async viteFinal(config) {
        const { mergeConfig } = await import('vite');
        return mergeConfig(config, {
          resolve: {
            alias: {
              '@your-scope/button': path.resolve(
                __dirname,
                '../../../packages/components/button/src/index.ts'
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
    import type { Preview } from '@storybook/react-vite';

    const preview: Preview = {
      parameters: { /* ... */ },
    };

    export default preview;
    ```

**Step 7: Create Documentation Content**

1. **Create Introduction Page** (`apps/docs/src/stories/Introduction.mdx`):
   ```mdx
   import { Meta } from '@storybook/blocks';

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
   import type { Meta, StoryObj } from '@storybook/react-vite';
   import { Button } from '@your-scope/button';

   const meta: Meta<typeof Button> = {
     title: 'Components/Button',
     component: Button,
     parameters: { layout: 'centered' },
     tags: ['autodocs'],
     argTypes: {
       variant: { control: 'radio', options: ['primary', 'secondary'] },
     },
   };

   export default meta;
   type Story = StoryObj<typeof meta>;

   export const Primary: Story = {
     args: {
       variant: 'primary',
       children: 'Primary Button',
     },
   };

   export const Secondary: Story = {
     args: {
       variant: 'secondary',
       children: 'Secondary Button',
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
    Add your `@your-scope/button` as a dependency. We also need `vite` and `globals` for our Storybook configuration.

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
        "@your-scope/button": "workspace:*",
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
    *Run `pnpm install` in the `docs` directory after saving.*

2.  **Delete Unnecessary Files**:
    You can delete everything inside `apps/docs/src`. We will create our stories there.

**Step 4: Configure Storybook for Monorepo Hot-Reloading**

This is a **critical** step to ensure that when you edit a component in `packages/`, Storybook instantly updates.

1.  **Modify `apps/docs/.storybook/main.ts`**:
    We need to tell Vite to look at our component's *source code*, not its pre-compiled `dist` folder. We do this by creating a resolve alias.

    ```ts
    // apps/docs/.storybook/main.ts
    import type { StorybookConfig } from '@storybook/react-vite';
    import path from 'path'; // Import path

    const config: StorybookConfig = {
      stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
      addons: [/* ... */],
      framework: {
        name: '@storybook/react-vite',
        options: {},
      },
      // Add this viteFinal config
      async viteFinal(config) {
        const { mergeConfig } = await import('vite');
        return mergeConfig(config, {
          resolve: {
            alias: {
              '@your-scope/button': path.resolve(
                __dirname,
                '../../../packages/components/button/src/index.ts'
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
    import type { Preview } from '@storybook/react-vite';

    const preview: Preview = {
      parameters: { /* ... */ },
    };

    export default preview;
    ```

**Step 5: Create the Button Story**

Now let's create the actual story file to display our button.

Create `apps/docs/src/stories/Button.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@your-scope/button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'radio', options: ['primary', 'secondary'] },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};
```
*Note the import from `@storybook/react-vite`, which is required by the linter.*

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