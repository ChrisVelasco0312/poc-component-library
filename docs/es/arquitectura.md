# Arquitectura

## Estructura del Monorepo

```
poc-component-library/
├── apps/
│   └── docs/                 # 📚 Documentación centralizada de Storybook
│       └── src/stories/      # Todas las historias y documentación de componentes
├── packages/
│   ├── components/
│   │   └── button/           # Componente @ChrisVelasco0312/poc-ui-button (puro)
│   └── config/
│       ├── eslint/           # @ChrisVelasco0312/poc-eslint-config
│       └── tsconfig/         # @ChrisVelasco0312/poc-tsconfig
├── package.json              # Paquete raíz con scripts
├── pnpm-workspace.yaml       # Configuración de workspaces de pnpm
└── turbo.json               # Pipeline de tareas de Turborepo
```

## Estrategia de Documentación

- **Componentes** (`packages/components/*`) se enfocan puramente en implementación
- **Documentación** (`apps/docs`) centraliza todas las historias, ejemplos y guías
- **Separación de Responsabilidades**: Los componentes no contienen sus propias historias
- **Mantenimiento Centralizado**: Todas las actualizaciones de documentación ocurren en un lugar

## Stack Tecnológico

- **Gestor de Paquetes**: pnpm con workspaces
- **Sistema de Build**: Turborepo para orquestación de tareas
- **Bundler**: Vite para builds de librería de componentes
- **Documentación**: Storybook para showcase de componentes
- **Calidad de Código**: ESLint con configuraciones compartidas
- **Registro**: GitHub Packages para publicación privada

## Archivos de Configuración

### Configuraciones Compartidas

- **TypeScript**: `packages/config/tsconfig/react-library.json`
- **ESLint**: `packages/config/eslint/react-library.js`

### Build y Desarrollo

- **Turborepo**: `turbo.json` - Orquestación de tareas
- **Workspaces**: `pnpm-workspace.yaml` - Vinculación de paquetes
- **Storybook**: `apps/docs/.storybook/` - Documentación de componentes

### Estructura de Documentación

- **Historias**: `apps/docs/src/stories/` - Todas las historias de componentes
- **Introducción**: `apps/docs/src/stories/Introduction.mdx` - Resumen de la librería
- **Ejemplos**: Cada componente tiene ejemplos de uso comprensivos 