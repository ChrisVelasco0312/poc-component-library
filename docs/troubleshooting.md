# Troubleshooting Guide

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