# Troubleshooting Guide

## CSS Styles Not Loading in Consumer Applications

**Symptoms:** Component imports work but styles are not applied. Buttons appear unstyled, missing background colors, padding, etc.

**Root Cause:** By default, Vite library builds extract CSS into separate files without automatically importing them into JavaScript bundles.

### Quick Fix:

1. **Check if CSS import exists** in your built JavaScript file:
   ```bash
   head -1 packages/components/dist/index.esm.js
   # Should show: import "./poc-ui-components.css";
   ```

2. **If CSS import is missing**, ensure your `packages/components/vite.config.ts` includes the CSS injector plugin:
   ```typescript
   {
     name: 'css-injector',
     writeBundle(options, bundle) {
       // Plugin code to inject CSS imports
     }
   }
   ```

3. **Verify SASS dependency** exists in `packages/components/package.json`:
   ```json
   {
     "devDependencies": {
       "sass": "^1.89.2"
     }
   }
   ```

4. **Check sideEffects** configuration in `package.json`:
   ```json
   {
     "sideEffects": ["**/*.css", "**/*.scss"]
   }
   ```

### Complete Solution:

See the **[CSS Bundling & Automatic Styles Guide](./guide/11-css-bundling-automatic-styles.md)** for the full implementation.

## Hot-Reloading Not Working in Storybook?

If you edit a component in `packages/components/*` and don't see the changes
reflected automatically in the `docs` Storybook app, it's likely because Vite is
resolving the pre-compiled code from the component's `dist` folder instead of
its source code.

### The Fix:

1. **Alias the package to its source:** In `apps/docs/.storybook/main.ts`, use
   the `viteFinal` function to create a resolve alias that points the component's
   package name to its source `index.ts` file. This forces Vite to watch the source
   files.

   ```ts
   // apps/docs/.storybook/main.ts
   async viteFinal(config) {
     const { mergeConfig } = await import('vite');
     return mergeConfig(config, {
       resolve: {
         alias: {
           '@ChrisVelasco0312/poc-ui-button': path.resolve(
             __dirname,
             '../../../packages/components/button/src/index.ts'
           ),
         },
       },
     });
   },
   ```

2. **Ensure `vite` is a dependency:** The `docs` app needs `vite` in its
   `devDependencies` to use `mergeConfig`.
3. **Remove incorrect CSS imports:** Ensure `apps/docs/.storybook/preview.ts`
   does **not** import any component CSS files (e.g.,
   `@ChrisVelasco0312/poc-ui-button/dist/button.css`). Components are responsible for importing their
   own styles directly in their `index.ts` file.

## CSS Classes Not Applied (CSS Modules Issues)

**Symptoms:** CSS is loading but class names don't match or styles aren't applied.

### Common Causes:

1. **CSS Module configuration mismatch** between development and build
2. **Incorrect CSS module import** syntax
3. **CSS specificity** issues

### Solutions:

1. **Verify CSS module configuration** in `vite.config.ts`:
   ```typescript
   css: {
     modules: {
       localsConvention: 'camelCase',
       generateScopedName: '[name]__[local]___[hash:base64:5]',
     },
   }
   ```

2. **Check component imports**:
   ```typescript
   // ✅ Correct
   import styles from "./Button.module.scss";
   
   // ❌ Wrong - don't import as side effect
   import "./Button.module.scss";
   ```

3. **Inspect generated class names** in browser dev tools to verify they match

## Build Errors

### "Cannot resolve module" Errors

**Error:** `Cannot resolve '@ChrisVelasco0312/poc-ui-button'`

**Solutions:**
1. Ensure workspace dependencies are properly linked: `pnpm install`
2. Check alias configuration in `vite.config.ts`
3. Verify package exists in `node_modules/.pnpm/`

### SASS Compilation Errors

**Error:** `Preprocessor dependency "sass" not found`

**Solution:** Install sass in the package that processes SCSS files:
```bash
cd packages/components
pnpm add -D sass
```

### TypeScript Errors

**Error:** `Cannot find module './Button.module.scss'`

**Solution:** Create CSS module type definitions:
```typescript
// src/styles.d.ts
declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}
```

## Next.js Integration Issues

### Turbopack Compatibility

If using Next.js with Turbopack (`next dev --turbo`), ensure:

1. **CSS imports are present** in your JavaScript bundles
2. **transpilePackages** is configured in `next.config.js`:
   ```javascript
   const nextConfig = {
     transpilePackages: ['@ChrisVelasco0312/poc-ui-components'],
   };
   ```

### CSR/SSR Hydration Issues

If you see hydration warnings with styled components:

1. **Use CSS modules** instead of CSS-in-JS for better SSR compatibility
2. **Ensure consistent styling** between server and client renders
3. **Check CSS loading order** in your application

## Getting Help

If these solutions don't resolve your issue:

1. **Check the complete guides** in `/docs/guide/`
2. **Verify your setup** follows the exact steps in the implementation guide
3. **Create a minimal reproduction** to isolate the problem
4. **Check console errors** for additional clues about the root cause 