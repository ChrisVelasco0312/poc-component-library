# Phase 5: Testing & Verification

This phase focuses on thoroughly testing your component library setup and ensuring everything works correctly before moving to advanced features.

## Comprehensive Testing Strategy

### 1. Unit Testing Setup (Optional but Recommended)

Add testing capabilities to your components:

```bash
# Install testing dependencies
pnpm add -D -w @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest jsdom
```

Create `packages/components/button/src/Button.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { Button } from './Button';
import { describe, it, expect } from 'vitest';

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Test Button</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Test Button');
  });

  it('applies primary variant by default', () => {
    render(<Button>Test Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('primary');
  });

  it('applies secondary variant when specified', () => {
    render(<Button variant="secondary">Test Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('secondary');
  });

  it('handles disabled state', () => {
    render(<Button disabled>Test Button</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### 2. Visual Testing with Storybook

Your Storybook setup already provides visual testing capabilities:

```bash
# Run Storybook and manually test each story
pnpm storybook
```

**Test checklist for each story:**
- ✅ Component renders without errors
- ✅ All variants display correctly
- ✅ Interactive controls work
- ✅ Props are properly typed
- ✅ Documentation is auto-generated

### 3. Build Verification

Ensure all packages build correctly:

```bash
# Clean previous builds
pnpm --filter @poc/button exec rm -rf dist
pnpm --filter @poc/themes exec rm -rf dist

# Rebuild everything
pnpm build

# Verify outputs exist
ls packages/components/button/dist/
ls packages/themes/dist/
```

Expected outputs:
- `button.es.js` and `button.umd.js`
- `index.d.ts` (TypeScript definitions)
- CSS files if applicable

### 4. Package Exports Testing

Test that your package exports work correctly:

```bash
# Navigate to button package
cd packages/components/button

# Test different import methods
node -e "console.log(require('./dist/button.umd.js'))"
node -e "import('./dist/button.es.js').then(m => console.log(m))"
```

### 5. TypeScript Integration Testing

Create a test TypeScript file to verify type exports:

```bash
# Create a temporary test file
cat > /tmp/type-test.ts << 'EOF'
import { Button, ButtonProps } from '@poc/button';

// This should type-check correctly
const props: ButtonProps = {
  variant: 'primary',
  children: 'Test',
  onClick: () => console.log('clicked')
};

// This should show type error
// const invalidProps: ButtonProps = {
//   variant: 'invalid', // Should error
//   children: 'Test'
// };
EOF

# Run TypeScript check
npx tsc --noEmit /tmp/type-test.ts
```

## Integration Testing

### External Consumer Testing

Test your library as an external consumer would use it:

```bash
# Create a test project outside your monorepo
cd ../..
mkdir component-library-test
cd component-library-test
pnpm init

# Add your local packages
pnpm add ../poc-component-library/packages/components/button
pnpm add ../poc-component-library/packages/themes
```

Create a simple test file:

```tsx
// test-integration.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from '@poc/button';

function TestApp() {
  return (
    <div>
      <h1>External Integration Test</h1>
      <Button variant="primary" onClick={() => alert('Primary clicked!')}>
        Primary Button
      </Button>
      <Button variant="secondary" onClick={() => alert('Secondary clicked!')}>
        Secondary Button
      </Button>
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<TestApp />);
}
```

### Cross-Platform Testing

Test on different environments:

**Node.js Environment:**
```bash
# Test SSR compatibility
node -e "
const React = require('react');
const { renderToString } = require('react-dom/server');
const { Button } = require('@poc/button');
console.log(renderToString(React.createElement(Button, {}, 'SSR Test')));
"
```

**Different Package Managers:**
```bash
# Test with npm
npm install @poc/button

# Test with yarn
yarn add @poc/button
```

## Performance Testing

### Bundle Size Analysis

Check the size of your built packages:

```bash
# Install bundle analyzer
pnpm add -D -w bundle-analyzer

# Analyze button package
cd packages/components/button
npx bundle-analyzer dist/button.es.js
```

### Tree Shaking Verification

Ensure your packages support tree shaking:

```bash
# Create a test import
echo "import { Button } from '@poc/button';" > /tmp/tree-shake-test.js

# Bundle with a tool that supports tree shaking
npx esbuild /tmp/tree-shake-test.js --bundle --minify --outfile=/tmp/output.js

# Check output size
ls -la /tmp/output.js
```

## Quality Assurance Checklist

### Component Quality
- ✅ **Accessibility**: Proper ARIA attributes and keyboard support
- ✅ **Responsive**: Works on different screen sizes
- ✅ **Browser Support**: Tested in major browsers
- ✅ **Performance**: No unnecessary re-renders
- ✅ **Memory Leaks**: Event listeners cleaned up

### Developer Experience
- ✅ **TypeScript**: Full type safety and IntelliSense
- ✅ **Documentation**: Clear props and usage examples
- ✅ **Error Messages**: Helpful error messages for misuse
- ✅ **Backwards Compatibility**: Semantic versioning followed

### Build Quality
- ✅ **Multiple Formats**: ESM and UMD builds available
- ✅ **Tree Shaking**: Unused code can be eliminated
- ✅ **Source Maps**: Available for debugging
- ✅ **Type Definitions**: Accurate TypeScript definitions

## Automated Testing Pipeline

### GitHub Actions Setup (Optional)

Create `.github/workflows/test.yml`:

```yaml
name: Test Component Library

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18, 20]
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'pnpm'
    
    - name: Install pnpm
      uses: pnpm/action-setup@v2
      with:
        version: 9
    
    - name: Install dependencies
      run: pnpm install --frozen-lockfile
    
    - name: Run linting
      run: pnpm lint
    
    - name: Run tests
      run: pnpm test
    
    - name: Build packages
      run: pnpm build
    
    - name: Build Storybook
      run: pnpm --filter docs build-storybook
```

## Troubleshooting Common Issues

### Import/Export Issues

**Problem**: `Cannot resolve module '@poc/button'`

**Solutions**:
1. Check package.json exports field
2. Verify TypeScript paths in tsconfig.json
3. Ensure packages are built before importing
4. Check workspace dependencies are properly linked

### Styling Issues

**Problem**: Styles not appearing in consuming applications

**Solutions**:
1. Import CSS files explicitly in consuming app
2. Check CSS modules configuration
3. Verify SCSS compilation
4. Ensure CSS custom properties are set

### Type Definition Issues

**Problem**: TypeScript can't find type definitions

**Solutions**:
1. Check `types` field in package.json points to correct file
2. Verify `declaration: true` in tsconfig.json
3. Ensure vite-plugin-dts is generating types
4. Check for any TypeScript compilation errors

### Hot Reloading Issues

**Problem**: Changes don't reflect in Storybook

**Solutions**:
1. Verify Vite alias points to source files, not dist
2. Check file watching is working
3. Restart Storybook development server
4. Clear browser cache and Storybook cache

## Success Metrics

Your component library is ready for the next phase when:

- ✅ **All builds pass** without errors or warnings
- ✅ **Storybook works** with hot reloading and auto-docs
- ✅ **External integration** works in test projects
- ✅ **TypeScript support** is complete and accurate
- ✅ **No console errors** in any environment
- ✅ **Bundle sizes** are reasonable and tree-shakeable

You're now ready to implement the theming system!

---

## Navigation

**[← Previous: Documentation App](./05-documentation-app.md)** | **[Next: Theming System →](./07-theming-system.md)** 