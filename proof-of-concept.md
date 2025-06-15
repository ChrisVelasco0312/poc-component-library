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
  - 'packages/config/*' # For shared configs
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
    "lint": "npx turbo lint"
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

Now we create our first reusable component as its own package.

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

### **Phase 3: Visual Development with Storybook**

Let's set up a place to view, test, and document our component.

**Step 1: Create the `docs` App**

```bash
# From the root directory
mkdir apps/docs
cd apps/docs
```

**Step 2: Initialize Storybook**

Run the Storybook initializer. When prompted, choose **Vite** and **TypeScript**.

```bash
npx storybook@latest init --yes
```

**Step 3: Clean Up Example Files**

Remove the example stories that come with Storybook to avoid conflicts:

```bash
rm -rf src/stories
```

**Step 4: Configure Storybook to Find Components**

Edit `apps/docs/.storybook/main.ts` to tell it where our component stories are located. **Important: Be specific with the path to avoid conflicts:**

```typescript
// apps/docs/.storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite';

import { join, dirname } from "path"

/**
* This function is used to resolve the absolute path of a package.
* It is needed in projects that use Yarn PnP or are set up within a monorepo.
*/
function getAbsolutePath(value: string): string {
  return dirname(require.resolve(join(value, 'package.json')))
}
const config: StorybookConfig = {
  stories: [
    "../../../packages/components/**/src/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-vitest")
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
};
export default config;
```

**Step 5: Create a Story for the Button**

**Important: Do NOT install @storybook/react in the component package as it causes conflicts.** Create the story file in your button package's `src` folder: `packages/components/button/src/Button.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

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
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};
```

**Step 6: Run Storybook**

Go to the root of the project and run:

```bash
cd apps/docs
pnpm storybook
```

Open `http://localhost:6006` in your browser. You should see your Button component! You can interact with it, and the "Docs" tab will show auto-generated documentation from your TypeScript types and JSDoc comments.

*Note: You'll see a warning about Tailwind CSS not being set up. This is expected since we used Tailwind classes in the Button. For a real project, you would add Tailwind to the `docs` app.*

---

### **Phase 4: Preparing for Private Publishing on GitHub**

Now let's configure everything to publish to the private GitHub Packages registry.

**Step 1: Configure `.npmrc`**

In the **root** of your project, create an `.npmrc` file. This tells pnpm to associate your scope with GitHub's registry.

```
# .npmrc
@your-scope:registry=https://npm.pkg.github.com/
```
**REPLACE `@your-scope` with your GitHub username/organization!**

**Step 2: Update `package.json` for Publishing**

Go to `packages/components/button/package.json` and add the `publishConfig` and `repository` fields.

```json
// packages/components/button/package.json
{
  // ... all the other fields
  "repository": {
    "type": "git",
    "url": "git+https://github.com/your-scope/poc-component-library.git",
    "directory": "packages/components/button"
  },
  "publishConfig": {
    "registry": "https://npm.pkg.github.com/"
  }
}
```
*   Replace `your-scope` and `poc-component-library` with your actual GitHub username and repository name.
*   You must create a repository on GitHub for this to work. Go to GitHub and create an empty repository named `poc-component-library`.

**Step 3: Generate a Personal Access Token (PAT)**

1.  Go to GitHub > Settings > Developer settings > Personal access tokens > **Tokens (classic)**.
2.  Click "Generate new token".
3.  Give it a name (e.g., "poc-library-publish").
4.  Set an expiration date.
5.  Select the **`write:packages`** scope. This is the only permission it needs.
6.  Click "Generate token" and **copy the token immediately**. You won't see it again.

---

### **Phase 5: Publishing the Package**

We'll do a manual publish from your machine to prove it works.

**Step 1: Commit Your Work**

**Important: Configure git user first if not already done:**

```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

```bash
# Add the remote origin for your repo
git remote add origin https://github.com/your-scope/poc-component-library.git

# Stage and commit all your files (properly excluding node_modules thanks to .gitignore)
git add .
git commit -m "feat: initial project setup with button component and storybook"
```

**Step 2: Authenticate and Publish**

1.  **Set the token as an environment variable in your terminal.** This is more secure than putting it in the `.npmrc` file.

    ```bash
    # Replace the placeholder with your actual token
    export NPM_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    ```

2.  **Publish the package!**
    From the root of your project, run the publish command specifically for the button package. You need to bump the version from `0.0.0` first. Manually change the version in `packages/components/button/package.json` to `"0.0.1"`.

    ```bash
    # Now, run the publish command
    pnpm publish --filter @your-scope/button
    ```

If everything is configured correctly, pnpm will build your package and upload it to GitHub Packages. You can verify this by going to your repository on GitHub and looking for the "Packages" section on the right-hand side.

---

### **Phase 6: Using Your Private Package**

This is the final test. Let's install and use our button in a brand new, separate project.

1.  **Create a test app outside your library project:**
    ```bash
    cd .. # Go up one level from your library folder
    npx create-next-app@latest test-consumer-app --ts --eslint --tailwind --app --src-dir --import-alias "@/*"
    cd test-consumer-app
    ```

2.  **Configure `.npmrc` in the new app:**
    Just like before, create an `.npmrc` file in the root of `test-consumer-app`:
    ```
    @your-scope:registry=https://npm.pkg.github.com/
    //npm.pkg.github.com/:_authToken=${NPM_TOKEN}
    ```
    *This time we add the `_authToken` line so that `pnpm install` can authenticate automatically.*

3.  **Set the auth token** in your terminal again (if you closed it):
    `export NPM_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

4.  **Install your button!**
    ```bash
    pnpm add @your-scope/button
    ```
    pnpm will now pull the package from your private GitHub Packages registry.

5.  **Use the component:**
    Open `src/app/page.tsx` in the new Next.js app, import your button, and use it.

    ```tsx
    import { Button } from '@your-scope/button'; // Your private package!

    export default function Home() {
      return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <h1 className="text-4xl">Welcome to our Test App!</h1>
          
          <div className="flex gap-4">
            <Button variant="primary" onClick={() => alert('Hello Primary!')}>
              My Library Button
            </Button>
            <Button variant="secondary" onClick={() => alert('Hello Secondary!')}>
              Another Button
            </Button>
          </div>
        </main>
      )
    }
    ```

6.  **Run the app:**
    `pnpm dev`

Visit `http://localhost:3000`. You will see your custom buttons, served from your private package, rendered in a completely separate application.

---

## **Key Lessons Learned & Important Notes**

### **Critical Issues Fixed in This Guide:**

1. **ESLint v9 Flat Config:** Modern ESLint requires the new flat config format, not .eslintrc
2. **Turborepo Version Compatibility:** Use `tasks` instead of `pipeline`, add `packageManager` field
3. **TypeScript JSX Configuration:** Explicit JSX configuration needed to avoid compilation errors
4. **Storybook Story Conflicts:** Don't install @storybook/react in component packages
5. **Git Configuration:** Always create .gitignore before committing and configure git user
6. **Module Type:** Add `"type": "module"` for ESM compatibility
7. **Path Resolution:** Use relative paths in vite.config.ts to avoid module resolution issues

### **Essential Dependencies Not Mentioned in Original Guide:**
- `@types/react` - Required for TypeScript React development
- `@types/node` - Required for Node.js types in build tools
- All ESLint related packages and configuration

Congratulations! You have successfully completed the entire lifecycle: building, documenting, linting, publishing, and consuming a component from a private library. You can now repeat the component creation process for additional components like `Input` and use tools like **Changesets** to automate the versioning and publishing process.