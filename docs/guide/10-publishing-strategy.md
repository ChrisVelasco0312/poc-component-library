# Phase 9: Publishing and Distribution Strategy

This comprehensive section covers the complete publishing workflow for your component library using GitHub as the primary distribution method.

## Overview of the Publishing Strategy

We'll use GitHub Package Registry, which provides:
- **Private/Public Control**: Keep your packages private or make them public
- **No npm Registry Dependency**: Avoid npm registry limitations and costs
- **GitHub Integration**: Seamless CI/CD with GitHub Actions
- **Access Control**: Use GitHub's robust permission system
- **Version Management**: Git tags for version control

## Phase 1: Preparing for Publication

### Step 1: Configure Package Registry Settings

Create/Update `.npmrc` in your project root:

```bash
# .npmrc
@ChrisVelasco0312:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
registry=https://registry.npmjs.org/
```

### Step 2: Install and Configure Changesets

```bash
# Install changesets
pnpm add -D -w @changesets/cli @changesets/changelog-github

# Initialize changesets
pnpm changeset init
```

Configure `.changeset/config.json`:

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

### Step 3: Update Root package.json Scripts

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

## Phase 2: Versioning Strategy

### Semantic Versioning Plan

- **MAJOR (X.0.0)**: Breaking changes that require consumer code updates
- **MINOR (0.X.0)**: New features that are backward compatible
- **PATCH (0.0.X)**: Bug fixes and small improvements

### Version Management Workflow

**Creating a Changeset:**

```bash
# Create a changeset for your changes
pnpm changeset

# Follow the prompts:
# - Select which packages are affected
# - Choose the type of change (major/minor/patch)
# - Write a summary of changes
```

**Version Bumping:**

```bash
# When ready to release, update versions
pnpm changeset version

# This will:
# - Update package.json versions
# - Update dependencies
# - Generate/update CHANGELOG.md files
# - Consume changeset files
```

### Branch Strategy for Releases

- **main**: Stable, production-ready code
- **develop**: Integration branch for features
- **feature/***: Individual feature branches
- **release/***: Preparation branches for releases

## Phase 3: Publishing Process

### Step 1: Manual Publishing Setup

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

### Step 2: Automated Publishing with GitHub Actions

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

### Step 3: Pre-publish Validation

Create `scripts/validate-packages.js`:

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

Add to root `package.json`:

```json
{
  "scripts": {
    "validate:packages": "node scripts/validate-packages.js",
    "publish:prepare": "pnpm validate:packages && pnpm build:packages"
  }
}
```

## Phase 4: Installation and Usage Instructions

### For New Projects Using Your Component Library

**Step 1: Authentication Setup**

Create `.npmrc` in the consuming project:

```bash
# .npmrc in the consuming project
@ChrisVelasco0312:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

**Step 2: Installation Commands**

#### Option A: Install Complete Library (Recommended)

```bash
# Install complete component library
npm install @ChrisVelasco0312/poc-ui-components @ChrisVelasco0312/poc-ui-themes
# or
pnpm add @ChrisVelasco0312/poc-ui-components @ChrisVelasco0312/poc-ui-themes
# or
yarn add @ChrisVelasco0312/poc-ui-components @ChrisVelasco0312/poc-ui-themes
```

#### Option B: Install Individual Packages

```bash
# Install individual components
npm install @ChrisVelasco0312/poc-ui-button @ChrisVelasco0312/poc-ui-themes

# Install only themes (for custom implementations)
npm install @ChrisVelasco0312/poc-ui-themes

# Install configuration packages
npm install @ChrisVelasco0312/poc-tsconfig @ChrisVelasco0312/poc-eslint-config
```

### Package Dependencies and Compatibility

| Package | Dependencies | Use Case |
|---------|-------------|----------|
| `@ChrisVelasco0312/poc-ui-components` | All component packages | Complete library installation |
| `@ChrisVelasco0312/poc-ui-button` | None (peer deps: React) | Individual button component |
| `@ChrisVelasco0312/poc-ui-themes` | React (peer dependency) | Theme system and providers |
| `@ChrisVelasco0312/poc-tsconfig` | None | TypeScript configuration |
| `@ChrisVelasco0312/poc-eslint-config` | ESLint plugins | Linting configuration |

### Framework-Specific Setup

#### For Next.js Projects

Add to `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@ChrisVelasco0312/poc-ui-components',
    '@ChrisVelasco0312/poc-ui-themes'
  ],
  experimental: {
    externalDir: true
  }
};

module.exports = nextConfig;
```

#### For TypeScript Projects

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

#### For Vite Projects

No additional configuration needed, but ensure you have the latest Vite version:

```bash
npm update vite @vitejs/plugin-react
```

### Usage Examples and Patterns

**Complete Library Usage:**

```tsx
import { Button } from '@ChrisVelasco0312/poc-ui-components';
import { ThemeProvider, atixTheme } from '@ChrisVelasco0312/poc-ui-themes';

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

**Individual Components:**

```tsx
import { Button } from '@ChrisVelasco0312/poc-ui-button';
import { ThemeProvider, atixTheme } from '@ChrisVelasco0312/poc-ui-themes';

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

**Dynamic Theme Switching:**

```tsx
import { useState } from 'react';
import { ThemeProvider, atixTheme, bancoWTheme } from '@ChrisVelasco0312/poc-ui-themes';
import { Button } from '@ChrisVelasco0312/poc-ui-components';

function App() {
  const [currentTheme, setCurrentTheme] = useState(atixTheme);

  const toggleTheme = () => {
    setCurrentTheme(prev => prev === atixTheme ? bancoWTheme : atixTheme);
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <Button onClick={toggleTheme}>Switch Theme</Button>
    </ThemeProvider>
  );
}
```

## Phase 5: Maintenance and Updates

### Updating the Library

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
npm outdated @ChrisVelasco0312/poc-ui-components @ChrisVelasco0312/poc-ui-themes

# Update to latest versions
npm update @ChrisVelasco0312/poc-ui-components @ChrisVelasco0312/poc-ui-themes

# Or update to specific version
npm install @ChrisVelasco0312/poc-ui-components@1.2.0
```

### Breaking Changes Management

**Communicating Breaking Changes:**

1. **Changelog**: Maintain detailed CHANGELOG.md files
2. **Migration Guides**: Create migration documentation for major versions
3. **Deprecation Warnings**: Add deprecation warnings before removing features
4. **Version Support**: Maintain support for previous major version

### Publishing Checklist

Before each release, ensure:

- [ ] All tests pass
- [ ] Documentation is updated
- [ ] Changesets are created for all changes
- [ ] Build artifacts are generated successfully
- [ ] Version numbers follow semver
- [ ] Breaking changes are documented
- [ ] CI/CD pipeline completes successfully
- [ ] GitHub release notes are prepared

## Troubleshooting Publishing Issues

### Common Issues and Solutions

**Authentication Failures:**
```bash
# Verify token has correct permissions
npm whoami --registry=https://npm.pkg.github.com
```

**Package Not Found:**
- Check if package is public
- Verify package name and scope
- Ensure user has access to the repository

**Version Conflicts:**
```bash
# Check existing versions
npm view @ChrisVelasco0312/poc-ui-components versions --json
```

**Build Failures:**
```bash
# Clean and rebuild
pnpm clean
pnpm install
pnpm build:packages
```

## Success Metrics

Your component library is successfully published when:

- ✅ **Packages are accessible** via GitHub Package Registry
- ✅ **Installation works** in external projects
- ✅ **Version management** follows semantic versioning
- ✅ **Automated publishing** works via GitHub Actions
- ✅ **Documentation is complete** and accessible
- ✅ **TypeScript support** is fully functional

Congratulations! You now have a complete, production-ready component library with automated publishing and comprehensive documentation.

---

## Navigation

**[← Previous: Unified Package](./09-unified-package.md)** | **[Next: CSS Bundling & Automatic Styles →](./11-css-bundling-automatic-styles.md)** 