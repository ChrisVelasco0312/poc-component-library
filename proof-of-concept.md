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

**Step 2: Configure pnpm Workspaces**

Create a file named `pnpm-workspace.yaml` in the root of your project:

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'packages/config/*' # For shared configs
```

**Step 3: Install and Configure Turborepo**

Turborepo will manage how we run tasks like `build` and `dev` across all our packages.

```bash
# Install Turborepo as a root-level dev dependency
pnpm add -D -w turborepo
```

Now, create a file named `turbo.json` in the root:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "baseBranch": "origin/main",
  "pipeline": {
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

**Step 4: Create Shared TypeScript and ESLint Configurations**

This is a key monorepo pattern. We define configs once and extend them in our packages.

1.  **Shared TypeScript Config:**
    ```bash
    # Create the directory for the shared tsconfig package
    mkdir -p packages/config/tsconfig

    # Create its package.json
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

2.  **Go back to the root:** `cd ../../..` (from `packages/config/tsconfig`)

3.  **Root `tsconfig.json`:** Create a `tsconfig.json` in the project root to make VS Code happy.
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

Run `pnpm init`. Then, edit the generated `package.json` to look like this. **Pay close attention to the `name`, `main`, `module`, `types`, and `files` fields.**

```json
// packages/components/button/package.json
{
  "name": "@your-scope/button",
  "version": "0.0.0",
  "description": "A simple button component",
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
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
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
# Install React as a peer dependency, and Vite/TS as dev dependencies
pnpm add react --save-peer
pnpm add -D typescript vite @vitejs/plugin-react vite-plugin-dts @your-scope/tsconfig
```
*Note: We are installing `@your-scope/tsconfig` which we just created! pnpm workspaces makes this possible.*

**Step 4: Configure TypeScript for the `button` Package**

Create `packages/components/button/tsconfig.json`:

```json
{
  "extends": "@your-scope/tsconfig/react-library.json",
  "include": ["src"],
  "exclude": ["dist", "build", "node_modules"]
}
```

**Step 5: Configure Vite for Library Bundling**

Create `packages/components/button/vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
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
      entry: path.resolve(__dirname, 'src/index.ts'),
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

**Step 6: Create the React Component**

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

**Step 7: Create the Package Entry Point**

Create `packages/components/button/src/index.ts` to export your component:

```typescript
export * from './Button';
```

**Step 8: Test the Build**

Go to the root of the monorepo (`cd ../../..`) and run:

```bash
pnpm --filter @your-scope/button build
# OR using Turborepo
pnpm turbo build --filter=@your-scope/button
```

You should see a new `dist` folder inside `packages/components/button` containing the bundled JS and type definition files. Success!

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
npx storybook@latest init
```
This will install a lot of dependencies and create a `.storybook` folder.

**Step 3: Configure Storybook to Find Components**

Edit `apps/docs/.storybook/main.ts` to tell it where our component stories are located. Replace the existing `stories` array.

```typescript
// apps/docs/.storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    '../../../packages/components/**/*.stories.@(js|jsx|mjs|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
};
export default config;
```

**Step 4: Create a Story for the Button**

Go back to your `button` package's `src` folder and create `packages/components/button/src/Button.stories.tsx`:

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

**Step 5: Run Storybook**

Go to the root of the project and run:

```bash
pnpm turbo dev --filter=docs
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

```bash
# Add the remote origin for your repo
git remote add origin https://github.com/your-scope/poc-component-library.git

# Stage and commit all your files
git add .
git commit -m "feat: initial project setup and button component"
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

Congratulations! You have successfully completed the entire lifecycle: building, documenting, publishing, and consuming a component from a private library. You can now repeat Phase 2 for the `Input` component and use a tool like **Changesets** to automate the versioning and publishing process.