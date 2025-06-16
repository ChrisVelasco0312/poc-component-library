# Architecture

## Monorepo Structure

```
poc-component-library/
├── apps/
│   └── docs/                 # 📚 Centralized Storybook documentation
│       └── src/stories/      # All component stories and docs
├── packages/
│   ├── components/
│   │   └── button/           # @poc/button component (pure)
│   └── config/
│       ├── eslint/           # @poc/eslint-config
│       └── tsconfig/         # @poc/tsconfig
├── package.json              # Root package with scripts
├── pnpm-workspace.yaml       # pnpm workspaces config
└── turbo.json               # Turborepo task pipeline
```

## Documentation Strategy

- **Components** (`packages/components/*`) focus purely on implementation
- **Documentation** (`apps/docs`) centralizes all stories, examples, and guides
- **Separation of Concerns**: Components don't contain their own stories
- **Centralized Maintenance**: All documentation updates happen in one place

## Tech Stack

- **Package Manager**: pnpm with workspaces
- **Build System**: Turborepo for task orchestration
- **Bundler**: Vite for component library builds
- **Documentation**: Storybook for component showcase
- **Code Quality**: ESLint with shared configurations
- **Registry**: GitHub Packages for private publishing

## Configuration Files

### Shared Configurations

- **TypeScript**: `packages/config/tsconfig/react-library.json`
- **ESLint**: `packages/config/eslint/react-library.js`

### Build & Development

- **Turborepo**: `turbo.json` - Task orchestration
- **Workspaces**: `pnpm-workspace.yaml` - Package linking
- **Storybook**: `apps/docs/.storybook/` - Component documentation

### Documentation Structure

- **Stories**: `apps/docs/src/stories/` - All component stories
- **Introduction**: `apps/docs/src/stories/Introduction.mdx` - Library overview
- **Examples**: Each component has comprehensive usage examples 