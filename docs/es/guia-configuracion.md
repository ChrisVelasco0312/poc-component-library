# Guía de Configuración

## Prerrequisitos

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- Git

## Instalación

```bash
git clone <url-de-tu-repo>
cd poc-component-library
pnpm install
```

## Scripts de Desarrollo

```bash
# Construir todos los paquetes
pnpm build

# Ejecutar Storybook para desarrollo de componentes
pnpm storybook

# Lint todos los paquetes
pnpm lint

# Construir paquete específico
pnpm --filter @poc/button build
```

## Publicación

### Configurar GitHub Packages

1. Crear un repositorio de GitHub
2. Generar un Personal Access Token con scope `write:packages`
3. Actualizar `.npmrc` con tu scope:
   ```
   @tu-scope:registry=https://npm.pkg.github.com/
   ```

### Publicar Componente

```bash
# Establecer token de auth
export NPM_TOKEN=tu_github_token

# Actualizar versión en package.json
# Luego publicar
pnpm publish --filter @tu-scope/tu-componente
```

## Agregar Nuevos Componentes

1. **Crear paquete de componente:**

   ```bash
   mkdir -p packages/components/tu-componente/src
   cd packages/components/tu-componente
   pnpm init
   ```

2. **Configurar package.json:**

   ```json
   {
     "name": "@poc/tu-componente",
     "type": "module",
     "main": "./dist/tu-componente.umd.js",
     "module": "./dist/tu-componente.es.js",
     "types": "./dist/index.d.ts",
     "devDependencies": {
       "@poc/tsconfig": "workspace:*",
       "@poc/eslint-config": "workspace:*"
     }
   }
   ```

3. **Agregar configuración de build:**

   - Copiar `vite.config.ts` del componente button
   - Copiar `tsconfig.json` del componente button
   - Copiar `eslint.config.js` del componente button

4. **Crear archivos del componente:**

   - `src/TuComponente.tsx` - El componente actual
   - `src/index.ts` - Punto de entrada de exportación

5. **Agregar a la app docs:**
   - Agregar componente como dependencia en `apps/docs/package.json`
   - Crear `apps/docs/src/stories/TuComponente.stories.tsx`
   - Importar y documentar en Storybook 