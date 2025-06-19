# Phase 11: CSS Bundling & Automatic Style Inclusion

**Critical Issue Alert**: By default, Vite library builds extract CSS into separate files without automatically importing them into your JavaScript bundles. This means consumers of your library get JavaScript components but no styles, breaking the developer experience.

## The Problem

When building component libraries with Vite, you'll encounter this common issue:

1. **Component imports styles correctly** in development
2. **Vite extracts CSS** into separate `.css` files during build
3. **JavaScript bundles don't import the CSS** automatically
4. **Consumer applications get unstyled components** unless they manually import CSS files

This breaks the "automatic styling" promise of component libraries. Users expect:

```typescript
import { Button } from '@your-library/components';
// Styles should work automatically - NO manual CSS imports required!
```

But without proper configuration, they need to do this:

```typescript
import { Button } from '@your-library/components';
import '@your-library/components/dist/styles.css'; // ❌ Manual CSS import required
```

## The Solution: Automatic CSS Import Injection

We solve this by creating a custom Vite plugin that automatically injects CSS imports into the generated JavaScript files.

### Step 1: Update the Unified Package Vite Configuration

Modify `packages/components/vite.config.ts`:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "path";
import { readFileSync, writeFileSync } from "fs";

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ["src/**/*"],
      exclude: ["**/*.stories.*", "**/*.test.*"]
    }),
    {
      name: 'css-injector',
      writeBundle(options, bundle) {
        const outDir = options.dir || 'dist';
        
        // Find CSS and JS files
        const cssFiles = Object.keys(bundle).filter(f => f.endsWith('.css'));
        const jsFiles = Object.keys(bundle).filter(f => f.endsWith('.js'));
        
        // Inject CSS imports into each JS file
        jsFiles.forEach(jsFile => {
          const jsPath = resolve(outDir, jsFile);
          let content = readFileSync(jsPath, 'utf-8');
          
          cssFiles.forEach(cssFile => {
            const cssImport = `import "./${cssFile}";\n`;
            if (!content.includes(cssImport)) {
              content = cssImport + content;
            }
          });
          
          writeFileSync(jsPath, content);
        });
      }
    }
  ],
  css: {
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: '[name]__[local]___[hash:base64:5]',
    },
  },
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
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@ChrisVelasco0312/poc-ui-button": resolve(__dirname, "../button/src"),
      // Future components will be added here:
      // "@poc/input": resolve(__dirname, "../input/src"),
    },
  },
});
```

### Step 2: Add Required Dependencies

Add `sass` to your unified package's dependencies:

```json
{
  "devDependencies": {
    "@ChrisVelasco0312/poc-tsconfig": "workspace:*",
    "@ChrisVelasco0312/poc-eslint-config": "workspace:*",
    "@vitejs/plugin-react": "^4.3.4",
    "sass": "^1.89.2",
    "typescript": "^5.8.3",
    "vite": "^6.0.1",
    "vite-plugin-dts": "^4.5.4"
  }
}
```

### Step 3: Update Package.json Exports

Enhance your `package.json` to properly expose CSS files and set side effects:

```json
{
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
    },
    "./dist/poc-ui-components.css": "./dist/poc-ui-components.css"
  },
  "sideEffects": [
    "**/*.css",
    "**/*.scss"
  ]
}
```

## How the Solution Works

1. **Components import styles normally**: Each component imports its CSS modules as usual
2. **Vite processes and extracts CSS**: During build, Vite processes SCSS files and extracts CSS
3. **Custom plugin injects imports**: Our `css-injector` plugin automatically adds CSS imports to the generated JavaScript
4. **Result**: JavaScript files automatically include their CSS dependencies

### Before (❌ Broken):

```javascript
// Generated dist/index.esm.js
import { jsx as u } from "react/jsx-runtime";
const Button = ({ children }) => {
  return u("button", { className: "button_abc123", children });
};
export { Button };
```

### After (✅ Working):

```javascript
// Generated dist/index.esm.js
import "./poc-ui-components.css";
import { jsx as u } from "react/jsx-runtime";
const Button = ({ children }) => {
  return u("button", { className: "button_abc123", children });
};
export { Button };
```

## Build and Test

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Build the library**:
   ```bash
   cd packages/components
   pnpm build
   ```

3. **Verify the output**:
   ```bash
   # Check that CSS import was injected
   head -1 dist/index.esm.js
   # Should show: import "./poc-ui-components.css";
   ```

## Testing in Consumer Applications

Create a test Next.js app to verify the solution:

```typescript
// pages/test.tsx
import { Button } from '@ChrisVelasco0312/poc-ui-components';

export default function Test() {
  return (
    <div>
      <Button variant="primary">Primary Button</Button>
      <Button variant="secondary">Secondary Button</Button>
    </div>
  );
}
```

**Expected Result**: Buttons should have proper styling automatically, without any manual CSS imports.

## Common Pitfalls to Avoid

### ❌ Using `cssCodeSplit: false` Alone

```typescript
// This DOESN'T work by itself
build: {
  cssCodeSplit: false,  // CSS still gets extracted without imports
}
```

### ❌ Manual CSS Imports in Components

```typescript
// Don't do this in individual components
import './Button.module.scss';  // Redundant with CSS modules
import styles from './Button.module.scss';  // This is sufficient
```

### ❌ Missing SASS Dependency

If you use `.scss` files, the unified package MUST have `sass` as a dependency, even if individual component packages have it.

## Advanced Configuration

### Custom CSS File Naming

You can customize the CSS output filename:

```typescript
build: {
  rollupOptions: {
    output: {
      assetFileNames: (assetInfo) => {
        if (assetInfo.name?.endsWith('.css')) {
          return 'styles/[name].[ext]';
        }
        return '[name].[ext]';
      }
    }
  }
}
```

### Multiple CSS Bundles

For libraries with many components, you might want component-specific CSS:

```typescript
build: {
  rollupOptions: {
    output: {
      assetFileNames: (assetInfo) => {
        if (assetInfo.name?.includes('button')) {
          return 'button/[name].[ext]';
        }
        return '[name].[ext]';
      }
    }
  }
}
```

## Troubleshooting

### CSS Not Loading in Next.js

If CSS still doesn't load in Next.js apps:

1. **Check Turbopack compatibility**: Use `next dev --turbo` to test with Turbopack
2. **Verify imports**: Check that `import "./styles.css"` appears in your JS bundle
3. **Check sideEffects**: Ensure `package.json` includes CSS files in `sideEffects`

### CSS Classes Not Applied

1. **Check CSS module naming**: Verify class names match between CSS and JavaScript
2. **Check CSS specificity**: Ensure your CSS has enough specificity
3. **Check CSS module configuration**: Verify `localsConvention` and `generateScopedName` settings

### Build Errors

1. **Missing SASS**: Install `sass` in the unified package
2. **Path resolution**: Verify component aliases in `vite.config.ts`
3. **TypeScript errors**: Ensure CSS module type definitions exist

## What We've Achieved

- ✅ **Automatic Style Loading**: Styles load automatically when components are imported
- ✅ **Zero Manual Configuration**: Consumers don't need to import CSS files manually
- ✅ **Proper CSS Bundling**: CSS is efficiently bundled and linked to JavaScript
- ✅ **Framework Compatibility**: Works with Next.js, Vite, and other modern bundlers
- ✅ **CSS Modules Support**: Maintains scoped styling with CSS modules
- ✅ **Production Ready**: Optimized builds with proper minification

This solution ensures your component library provides the smooth developer experience users expect from modern React component libraries.

---

## Navigation

**[← Previous: Publishing Strategy](./10-publishing-strategy.md)** | **[Next: Advanced Topics →](./12-advanced-topics.md)** 