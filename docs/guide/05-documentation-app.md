# Phase 4: Documentation App & Testing

This phase covers additional documentation setup, testing your components, and creating a test consumer app to verify everything works.

## Alternative Vite Setup (Optional)

If you want to create a separate Vite app alongside Storybook for testing:

### Create a Vite React App for Docs

```bash
# From the root of the project
cd apps
# Create a React + TypeScript app using Vite
pnpm create vite docs --template react-ts
# Enter the new directory
cd docs
```

### Configure the Docs App

Modify `apps/docs/package.json` to include your component packages:

```json
{
  "name": "docs",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  },
  "dependencies": {
    "@ChrisVelasco0312/poc-ui-button": "workspace:*",
    "@ChrisVelasco0312/poc-ui-themes": "workspace:*",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    // ... existing dev dependencies
  }
}
```

### Create a Test App

Update `apps/docs/src/App.tsx`:

```tsx
import { Button } from "@ChrisVelasco0312/poc-ui-button";

function App() {
  return (
    <>
      <div>
        <h1>Component Library Docs</h1>
        <p>This is a simple documentation site.</p>
        <Button variant="primary">Primary Button</Button>
        <Button variant="secondary">Secondary Button</Button>
      </div>
    </>
  );
}

export default App;
```

## Testing Your Setup

### Running the Documentation

```bash
# From root directory
pnpm install

# Run Storybook
pnpm storybook

# Or run the Vite dev server (if you created it)
pnpm --filter docs dev
```

### Verification Checklist

Ensure the following works correctly:

- ✅ **Storybook loads** at `http://localhost:6006`
- ✅ **Button component displays** with both variants
- ✅ **Hot reloading works** - edit Button component and see changes
- ✅ **Auto-generated docs** appear for the Button component
- ✅ **No console errors** in browser developer tools

### Build Testing

Test that everything builds correctly:

```bash
# Build all packages
pnpm build

# Build Storybook
pnpm --filter docs build-storybook
```

You should see:
- All packages build without errors
- Storybook static files generated in `apps/docs/storybook-static/`

## Creating a Test Consumer App

Let's create a separate test app to verify your component library works as an external consumer would use it.

### Step 1: Create Test App Outside Your Library

```bash
# Go up one level from your library folder
cd .. 
npx create-next-app@latest test-consumer-app --ts --eslint --tailwind --app --src-dir --import-alias "@/*"
cd test-consumer-app
```

### Step 2: Link Your Local Packages

Since your packages aren't published yet, you can test them locally:

```bash
# Add your local packages
pnpm add ../poc-component-library/packages/components/button
pnpm add ../poc-component-library/packages/themes
```

Or use `pnpm link` for development:

```bash
# In your component library root
cd ../poc-component-library
pnpm --filter @ChrisVelasco0312/poc-ui-button build
pnpm --filter @ChrisVelasco0312/poc-ui-themes build

# In the test app
cd ../test-consumer-app
pnpm link ../poc-component-library/packages/components/button
pnpm link ../poc-component-library/packages/themes
```

### Step 3: Test Integration

Update `test-consumer-app/src/app/page.tsx`:

```tsx
import { Button } from "@ChrisVelasco0312/poc-ui-button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Testing Component Library</h1>
        
        <div className="space-x-4 mb-8">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
        </div>

        <div className="space-x-4">
          <Button variant="primary" disabled>Disabled Primary</Button>
          <Button variant="secondary" disabled>Disabled Secondary</Button>
        </div>
      </div>
    </main>
  );
}
```

### Step 4: Run and Verify

```bash
# Run the test app
pnpm dev
```

Open `http://localhost:3000` and verify:
- ✅ **Buttons render correctly** with proper styling
- ✅ **Variants work** (primary vs secondary)
- ✅ **States work** (disabled buttons)
- ✅ **No build errors** in the terminal
- ✅ **No console errors** in browser

## Troubleshooting Common Issues

### Hot Reloading Not Working

If changes to components don't show up in Storybook:

1. **Check alias paths** in `.storybook/main.ts`
2. **Verify source imports** - should import from `src/`, not `dist/`
3. **Restart Storybook** - sometimes needed after config changes

### Build Failures

If builds fail:

```bash
# Clean all build outputs
find . -name "dist" -type d -exec rm -rf {} +
find . -name "node_modules" -type d -exec rm -rf {} +

# Reinstall dependencies
pnpm install

# Rebuild everything
pnpm build
```

### Import Issues

If imports don't work in the test app:

1. **Check package names** in `package.json`
2. **Verify exports** in component package.json
3. **Rebuild packages** before testing
4. **Check TypeScript paths** in `tsconfig.json`

### Styling Issues

If button styles don't appear:

1. **Import CSS** in your app or component
2. **Check CSS modules** are working
3. **Verify SCSS compilation** in Vite config
4. **Check theme variables** are being set

## What We've Achieved

At this point, you have:

- ✅ **Working Component Library**: Button component with theme integration
- ✅ **Documentation System**: Storybook with auto-generated docs
- ✅ **Development Setup**: Hot reloading and build pipeline
- ✅ **Testing Strategy**: Local testing and external consumption verification
- ✅ **Monorepo Foundation**: Scalable structure for adding more components

You're now ready to add theming and create more components!

---

## Navigation

**[← Previous: Storybook Setup](./04-storybook-setup.md)** | **[Next: Testing & Verification →](./06-testing-verification.md)** 