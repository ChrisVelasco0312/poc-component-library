# POC Component Library

A **proof of concept** for building a modern UI component library using React, TypeScript, and a monorepo architecture. This repository serves as a starting point and reference implementation for creating your own component library.

## 🎯 Purpose

This project demonstrates how to:
- Build reusable React components with TypeScript
- Set up a monorepo with shared configurations
- Document components with Storybook
- Publish components to GitHub Packages (private registry)
- Maintain code quality with ESLint and automated workflows

## 🏗️ Architecture

### Monorepo Structure
```
poc-component-library/
├── apps/
│   └── docs/                 # Storybook documentation
├── packages/
│   ├── components/
│   │   └── button/           # @poc/button component
│   └── config/
│       ├── eslint/           # @poc/eslint-config
│       └── tsconfig/         # @poc/tsconfig
├── package.json              # Root package with scripts
├── pnpm-workspace.yaml       # pnpm workspaces config
└── turbo.json               # Turborepo task pipeline
```

### Tech Stack
- **Package Manager**: pnpm with workspaces
- **Build System**: Turborepo for task orchestration
- **Bundler**: Vite for component library builds
- **Documentation**: Storybook for component showcase
- **Code Quality**: ESLint with shared configurations
- **Registry**: GitHub Packages for private publishing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (`npm install -g pnpm`)
- Git

### Installation
```bash
git clone <your-repo-url>
cd poc-component-library
pnpm install
```

### Development Scripts
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

## 📦 Components

### Button Component (`@poc/button`)
A simple, customizable button component with TypeScript support.

**Features:**
- Primary/Secondary variants
- Full TypeScript definitions
- ESM and UMD builds
- Storybook documentation

**Usage:**
```tsx
import { Button } from '@poc/button';

<Button variant="primary" onClick={() => alert('Hello!')}>
  Click me
</Button>
```

## 📚 Documentation

Component documentation is available through Storybook:
```bash
pnpm storybook
# Opens http://localhost:6006
```

## 🔧 Adding New Components

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

4. **Create component and story files:**
   - `src/YourComponent.tsx`
   - `src/index.ts`
   - `src/YourComponent.stories.tsx`

## 🚢 Publishing

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

## 🛠️ Configuration Files

### Shared Configurations
- **TypeScript**: `packages/config/tsconfig/react-library.json`
- **ESLint**: `packages/config/eslint/react-library.js`

### Build & Development
- **Turborepo**: `turbo.json` - Task orchestration
- **Workspaces**: `pnpm-workspace.yaml` - Package linking
- **Storybook**: `apps/docs/.storybook/` - Component documentation

## 📋 Best Practices Demonstrated

1. **Monorepo Management**: Shared configurations and workspace dependencies
2. **Type Safety**: Full TypeScript coverage with declaration files
3. **Code Quality**: ESLint with React and TypeScript rules
4. **Documentation**: Automated component docs with Storybook
5. **Build Optimization**: Tree-shakeable ESM builds with Vite
6. **Private Registry**: Secure component distribution via GitHub Packages

## 🔗 Using This as a Template

To create your own component library based on this POC:

1. **Fork/Clone** this repository
2. **Replace scope**: Search and replace `@poc` with `@your-scope`
3. **Update repository URLs** in package.json files
4. **Add your components** following the established patterns
5. **Configure CI/CD** for automated publishing
6. **Customize Storybook** theme and documentation

## 📖 Related Documentation

- [Detailed Setup Guide](./proof-of-concept.md) - Step-by-step implementation guide
- [Execution Plan](./execution-plan.md) - Structured development checklist

## 🤝 Contributing

This is a proof of concept repository. Feel free to:
- Fork and adapt for your needs
- Report issues with the setup process
- Suggest improvements to the architecture

## 📄 License

ISC License - Feel free to use this as a foundation for your own projects.

---

**Note**: This is a proof of concept designed for learning and as a starting point. For production use, consider additional tooling like automated testing, changesets for versioning, and CI/CD pipelines. 