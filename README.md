# POC Component Library

A **proof of concept** for building a modern UI component library using React,
TypeScript, and a monorepo architecture. This repository serves as a starting
point and reference implementation for creating your own component library.

## 🎯 Purpose

This project demonstrates how to:

- Build reusable React components with TypeScript
- Set up a monorepo with shared configurations
- Document components with Storybook in a centralized docs app
- Publish components to GitHub Packages (private registry)
- Maintain code quality with ESLint and automated workflows

## 📚 Documentation

- [Architecture](./docs/architecture.md) - Detailed architecture and tech stack
- [Setup Guide](./docs/setup-guide.md) - Installation and development setup
- [Implementation Guide](./docs/implementation-guide.md) - Step-by-step implementation details
- [Styling Guide](./docs/styling-guide.md) - SCSS modules and styling patterns
- [Troubleshooting](./docs/troubleshooting.md) - Common issues and solutions
- [Contributing](./docs/contributing.md) - How to contribute to this project

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development
pnpm storybook
```

## 📦 Components

### Button Component (`@poc/button`)

A simple, customizable button component with TypeScript support.

**Features:**

- Primary/Secondary variants
- Full TypeScript definitions
- ESM and UMD builds
- Centralized Storybook documentation

**Usage:**

```tsx
import { Button } from "@poc/button";

<Button variant="primary" onClick={() => alert("Hello!")}>
  Click me
</Button>;
```

## 📋 Best Practices Demonstrated

1. **Separation of Concerns**: Components focus on functionality, docs on presentation
2. **Centralized Documentation**: All stories and guides in one maintainable location
3. **Type Safety**: Full TypeScript coverage with declaration files
4. **Code Quality**: ESLint with React and TypeScript rules
5. **Build Optimization**: Tree-shakeable ESM builds with Vite
6. **Private Registry**: Secure component distribution via GitHub Packages

## 🔗 Using This as a Template

To create your own component library based on this POC:

1. **Fork/Clone** this repository
2. **Replace scope**: Search and replace `@poc` with `@your-scope`
3. **Update repository URLs** in package.json files
4. **Add your components** following the established patterns
5. **Update documentation** in the docs app
6. **Configure CI/CD** for automated publishing
7. **Customize Storybook** theme and documentation

## 📖 Related Documentation

- [Detailed Setup Guide](./proof-of-concept.md) - Step-by-step implementation guide
- [Execution Plan](./execution-plan.md) - Structured development checklist

## 💡 Troubleshooting

### Hot-Reloading Not Working in Storybook?

If you edit a component in `packages/components/*` and don't see the changes
reflected automatically in the `docs` Storybook app, it's likely because Vite is
resolving the pre-compiled code from the component's `dist` folder instead of
its source code.

**The Fix:**

1.  **Alias the package to its source:** In `apps/docs/.storybook/main.ts`, use
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
                '@poc/button': path.resolve(
                  __dirname,
                  '../../../packages/components/button/src/index.ts'
                ),
              },
            },
          });
        },
        ```

2.  **Ensure `vite` is a dependency:** The `docs` app needs `vite` in its
    `devDependencies` to use `mergeConfig`.
3.  **Remove incorrect CSS imports:** Ensure `apps/docs/.storybook/preview.ts`
    does **not** import any component CSS files (e.g.,
    `@poc/button/dist/button.css`). Components are responsible for importing their
    own styles directly in their `index.ts` file.

## 🤝 Contributing

This is a proof of concept repository. Feel free to:

- Fork and adapt for your needs
- Report issues with the setup process
- Suggest improvements to the architecture

## 📄 License

ISC License - Feel free to use this as a foundation for your own projects.

---

**Note**: This is a proof of concept designed for learning and as a starting
point. For production use, consider additional tooling like automated testing,
changesets for versioning, and CI/CD pipelines.
