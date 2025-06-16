# Setup Guide

## Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- Git

## Installation

```bash
git clone <your-repo-url>
cd poc-component-library
pnpm install
```

## Development Scripts

```bash
# Build all packages
pnpm build

# Run Storybook for component development
pnpm storybook

# Lint all packages
pnpm lint

# Build specific package
pnpm --filter @poc/button build
```

## Publishing

### Setup GitHub Packages

1. Create a GitHub repository
2. Generate a Personal Access Token with `write:packages` scope
3. Update `.npmrc` with your scope:
   ```
   @your-scope:registry=https://npm.pkg.github.com/
   ```

### Publish Component

```bash
# Set auth token
export NPM_TOKEN=your_github_token

# Update version in package.json
# Then publish
pnpm publish --filter @your-scope/your-component
```

## Adding New Components

1. **Create component package:**

   ```bash
   mkdir -p packages/components/your-component/src
   cd packages/components/your-component
   pnpm init
   ```

2. **Configure package.json:**

   ```json
   {
     "name": "@poc/your-component",
     "type": "module",
     "main": "./dist/your-component.umd.js",
     "module": "./dist/your-component.es.js",
     "types": "./dist/index.d.ts",
     "devDependencies": {
       "@poc/tsconfig": "workspace:*",
       "@poc/eslint-config": "workspace:*"
     }
   }
   ```

3. **Add build configuration:**

   - Copy `vite.config.ts` from button component
   - Copy `tsconfig.json` from button component
   - Copy `eslint.config.js` from button component

4. **Create component files:**

   - `src/YourComponent.tsx` - The actual component
   - `src/index.ts` - Export entry point

5. **Add to docs app:**
   - Add component as dependency in `apps/docs/package.json`
   - Create `apps/docs/src/stories/YourComponent.stories.tsx`
   - Import and document in Storybook 