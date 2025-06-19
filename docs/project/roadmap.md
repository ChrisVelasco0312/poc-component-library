# Component Library POC - Execution Plan

## Overview
This plan outlines the step-by-step execution of a proof-of-concept component library using:
- **Monorepo**: pnpm workspaces + Turborepo
- **Scope**: `@poc` (private packages)
- **Components**: React components with TypeScript
- **Documentation**: Storybook
- **Publishing**: GitHub Packages (private registry)

---

## Prerequisites Checklist
- [ ] Node.js (v18+) installed
- [ ] pnpm installed (`npm install -g pnpm`)
- [ ] Git installed
- [ ] GitHub account created
- [ ] Code editor (VS Code recommended)

---

## Phase 1: Monorepo Foundation Setup

### 1.1 Project Initialization
```bash
# Create and initialize project
mkdir poc-component-library
cd poc-component-library
git init
pnpm init
mkdir -p packages apps
```

### 1.2 Workspace Configuration
- [ ] Create `pnpm-workspace.yaml`:
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'packages/config/*'
```

### 1.3 Turborepo Setup
```bash
# Install Turborepo
pnpm add -D -w turborepo
```
- [ ] Create `turbo.json` with build pipeline configuration

### 1.4 Shared Configurations
- [ ] Create `packages/config/tsconfig/` directory structure
- [ ] Setup `@ChrisVelasco0312/poc-tsconfig` package with `react-library.json`
- [ ] Create root `tsconfig.json` for VS Code support

**Expected Structure After Phase 1:**
```
poc-component-library/
├── packages/
│   └── config/
│       └── tsconfig/
├── apps/
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.json
└── package.json
```

---

## Phase 2: First Component Development

### 2.1 Button Package Creation
```bash
# Create button component package
mkdir -p packages/components/button/src
cd packages/components/button
pnpm init
```

### 2.2 Package Configuration
- [ ] Configure `package.json` with:
  - Name: `@ChrisVelasco0312/poc-ui-button`
  - Proper exports and entry points
  - Build scripts and dependencies
- [ ] Install dependencies:
```bash
pnpm add react --save-peer
pnpm add -D typescript vite @vitejs/plugin-react vite-plugin-dts @ChrisVelasco0312/poc-tsconfig
```

### 2.3 Build Configuration
- [ ] Create `tsconfig.json` extending `@ChrisVelasco0312/poc-tsconfig`
- [ ] Create `vite.config.ts` for library bundling

### 2.4 Component Development
- [ ] Create `src/Button.tsx` with TypeScript interface
- [ ] Create `src/index.ts` as entry point
- [ ] Test build: `pnpm turbo build --filter=@ChrisVelasco0312/poc-ui-button`

**Expected Structure After Phase 2:**
```
packages/components/button/
├── src/
│   ├── Button.tsx
│   └── index.ts
├── dist/ (after build)
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Phase 3: Storybook Documentation

### 3.1 Storybook Setup
```bash
# Create docs app
mkdir apps/docs
cd apps/docs
npx storybook@latest init
```

### 3.2 Storybook Configuration
- [ ] Configure `apps/docs/.storybook/main.ts` to find component stories
- [ ] Update stories path to: `../../../packages/components/**/*.stories.@(js|jsx|mjs|ts|tsx)`

### 3.3 Story Creation
- [ ] Create `packages/components/button/src/Button.stories.tsx`
- [ ] Configure story with Primary and Secondary variants
- [ ] Test: `pnpm turbo dev --filter=docs`

**Expected Result:** Storybook running at `http://localhost:6006` with Button component documentation

---

## Phase 4: GitHub Publishing Setup

### 4.1 Registry Configuration
- [ ] Create root `.npmrc`:
```
@ChrisVelasco0312:registry=https://npm.pkg.github.com/
```

### 4.2 Package Publishing Config
- [ ] Update `packages/components/button/package.json` with:
  - Repository URL
  - Publishing configuration for GitHub Packages

### 4.3 GitHub Repository Setup
- [ ] Create GitHub repository: `poc-component-library`
- [ ] Generate Personal Access Token (PAT) with `write:packages` scope
- [ ] Store PAT securely

---

## Phase 5: Package Publishing

### 5.1 Version and Commit
```bash
# Commit initial work
git remote add origin https://github.com/[username]/poc-component-library.git
git add .
git commit -m "feat: initial project setup and button component"
```

### 5.2 Publishing Process
- [ ] Update button package version to `0.0.1`
- [ ] Set environment variable: `export NPM_TOKEN=ghp_xxxxx`
- [ ] Publish: `pnpm publish --filter @ChrisVelasco0312/poc-ui-button`
- [ ] Verify package appears in GitHub Packages

---

## Phase 6: Package Consumption Test

### 6.1 Test Application Setup
```bash
# Create separate test app
cd ..
npx create-next-app@latest test-consumer-app --ts --eslint --tailwind --app --src-dir --import-alias "@/*"
cd test-consumer-app
```

### 6.2 Private Package Installation
- [ ] Create `.npmrc` with auth token
- [ ] Install package: `pnpm add @ChrisVelasco0312/poc-ui-button`

### 6.3 Integration Test
- [ ] Import and use `@ChrisVelasco0312/poc-ui-button` in Next.js page
- [ ] Test functionality: `pnpm dev`
- [ ] Verify buttons work at `http://localhost:3000`

---

## Success Criteria
- [ ] Monorepo structure with shared configurations
- [ ] Button component builds successfully
- [ ] Storybook documentation displays component
- [ ] Package publishes to GitHub Packages
- [ ] External app can install and use the private package
- [ ] Full development-to-consumption lifecycle works

---

## Next Steps (Post-POC)
1. **Add Input Component**: Repeat Phase 2 for an Input component
2. **Automation**: Implement Changesets for automated versioning
3. **CI/CD**: Setup GitHub Actions for automated publishing
4. **Testing**: Add unit tests with Jest/Vitest
5. **Styling**: Integrate proper CSS-in-JS or Tailwind setup

---

## Notes
- Replace `[username]` with actual GitHub username
- Store NPM_TOKEN securely (environment variable, not in files)
- All `@poc` packages will be private by default
- Storybook may show Tailwind warnings (expected without proper CSS setup) 