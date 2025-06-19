# Phase 1: Setting Up the Monorepo Foundation

This phase creates the skeleton of our project with all the necessary configuration for a modern monorepo.

## Step 1: Initialize the Project

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

## Step 2: Create .gitignore (CRITICAL - Do this before committing!)

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

## Step 3: Configure pnpm Workspaces

Create a file named `pnpm-workspace.yaml` in the root of your project:

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
  - "packages/config/*"
  - "packages/components/*" # For component packages
```

## Step 4: Install and Configure Turborepo

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

## Step 5: Update Root package.json

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

## Step 6: Create Shared TypeScript and ESLint Configurations

This is a key monorepo pattern. We define configs once and extend them in our packages.

### Shared TypeScript Config

```bash
# Create the directory for the shared tsconfig package
mkdir -p packages/config/tsconfig
cd packages/config/tsconfig
pnpm init
```

In `packages/config/tsconfig/package.json`, set the name to `@ChrisVelasco0312/poc-tsconfig` and make it private.

```json
{
  "name": "@ChrisVelasco0312/poc-tsconfig",
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

### Shared ESLint Config

```bash
# Create the directory for the shared ESLint package
mkdir -p packages/config/eslint
cd packages/config/eslint
```

Create `packages/config/eslint/package.json`:

```json
{
  "name": "@ChrisVelasco0312/poc-eslint-config",
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

### Install ESLint dependencies at root

```bash
cd ../../..
pnpm add -D -w eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-react eslint-plugin-react-hooks @eslint/js
```

### Create Root tsconfig.json

Go back to the root: `cd ../../..` (from `packages/config/eslint`)

Create a `tsconfig.json` in the project root to make VS Code happy:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx"
  }
}
```

## Verification

At this point, your project structure should look like this:

```
poc-component-library/
├── packages/
│   └── config/
│       ├── eslint/
│       │   ├── package.json
│       │   └── react-library.js
│       └── tsconfig/
│           ├── package.json
│           └── react-library.json
├── apps/
├── .gitignore
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── tsconfig.json
```

Run these commands to verify everything is set up correctly:

```bash
# Install all dependencies
pnpm install

# Verify Turborepo is working
pnpm build
```

You should see Turborepo running successfully (even if no packages are built yet).

---

## Navigation

**[← Previous: Prerequisites](./01-prerequisites.md)** | **[Next: First Component →](./03-first-component.md)** 