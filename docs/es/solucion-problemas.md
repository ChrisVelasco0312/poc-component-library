# Guía de Solución de Problemas

## ¿Hot-Reloading No Funciona en Storybook?

Si editas un componente en `packages/components/*` y no ves los cambios
reflejados automáticamente en la app `docs` de Storybook, es probable que Vite esté
resolviendo el código precompilado de la carpeta `dist` del componente en lugar de
su código fuente.

### La Solución:

1. **Crear alias del paquete a su fuente:** En `apps/docs/.storybook/main.ts`, usa
   la función `viteFinal` para crear un alias de resolución que apunte el nombre del paquete
   del componente a su archivo fuente `index.ts`. Esto fuerza a Vite a observar los archivos
   fuente.

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

2. **Asegurar que `vite` sea una dependencia:** La app `docs` necesita `vite` en sus
   `devDependencies` para usar `mergeConfig`.
3. **Remover importaciones CSS incorrectas:** Asegurar que `apps/docs/.storybook/preview.ts`
   **no** importe ningún archivo CSS de paquetes de componentes (ej.,
   `@ChrisVelasco0312/poc-ui-button/dist/button.css`). Los componentes son responsables de importar sus
   propios estilos directamente en su archivo `index.ts`. 