# Guía de Implementación Completa

## Prerrequisitos

1. **Node.js & pnpm:** Asegúrate de tener Node.js (v18+) y pnpm instalados. Si no: `npm install -g pnpm`.
2. **Git & Cuenta GitHub:** Necesitas una cuenta GitHub y Git instalado.
3. **Editor de Código:** VS Code o cualquier otro editor moderno.
4. **Scope GitHub:** Tu "scope" será tu nombre de usuario GitHub o nombre de organización. Para esta guía, usaré el placeholder **`@tu-scope`**. **Debes reemplazar esto donde aparezca.**

---

## Fase 1: Configurando la Base del Monorepo

Esta fase crea el esqueleto de nuestro proyecto.

### Paso 1: Inicializar el Proyecto

```bash
# Crear y entrar al directorio del proyecto
mkdir poc-component-library
cd poc-component-library

# Inicializar un repositorio git
git init

# Inicializar pnpm
pnpm init

# Crear los directorios principales
mkdir -p packages apps
```

### Paso 2: Crear .gitignore

```gitignore
# Dependencias
node_modules/
.pnp
.pnp.js

# Builds de producción
dist/
build/
*.tsbuildinfo

# Variables de entorno
.env
.env.local

# Logs
npm-debug.log*
yarn-debug.log*
pnpm-debug.log*

# Salidas de build de Storybook
storybook-static/

# Archivos del editor
.vscode/
.idea/

# Archivos del OS
.DS_Store
Thumbs.db
```

### Paso 3: Configurar pnpm Workspaces

Crear `pnpm-workspace.yaml`:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'packages/config/*'
  - 'packages/components/*'
```

### Paso 4: Configurar Turborepo

```bash
# Instalar Turborepo
pnpm add -D -w turborepo
```

Crear `turbo.json`:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "lint": {},
    "dev": {
      "cache": false,
      "persistent": true
    },
    "storybook": {
      "cache": false,
      "persistent": true
    }
  }
}
```

---

## Fase 2: Construyendo el Primer Componente (Button)

### Paso 1: Crear el Paquete Button

```bash
mkdir -p packages/components/button/src
cd packages/components/button
pnpm init
```

### Paso 2: Configurar package.json

```json
{
  "name": "@tu-scope/button",
  "version": "0.0.0",
  "description": "Un componente de botón simple",
  "type": "module",
  "main": "./dist/button.umd.js",
  "module": "./dist/button.es.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/button.es.js",
      "require": "./dist/button.umd.js"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "vite build",
    "lint": "eslint src --max-warnings 0"
  },
  "publishConfig": {
    "access": "restricted"
  }
}
```

### Paso 3: Crear el Componente React

Crear `packages/components/button/src/Button.tsx`:

```tsx
import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * ¿Es esta la acción principal en la página?
   */
  variant?: 'primary' | 'secondary';
  /**
   * Contenido del botón
   */
  children: React.ReactNode;
}

/**
 * Componente UI principal para interacción del usuario
 */
export const Button = ({ variant = 'primary', children, ...props }: ButtonProps) => {
  const mode = variant === 'primary' ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-500 hover:bg-gray-700';
  return (
    <button
      type="button"
      className={['text-white', 'font-bold', 'py-2', 'px-4', 'rounded', mode].join(' ')}
      {...props}
    >
      {children}
    </button>
  );
};
```

Crear `packages/components/button/src/index.ts`:

```typescript
export * from './Button';
```

---

## Fase 3: Documentación Centralizada con Storybook

### Paso 1: Crear la App docs

```bash
mkdir apps/docs
cd apps/docs
npx storybook@latest init --yes
```

### Paso 2: Configurar Hot-Reloading

Modificar `apps/docs/.storybook/main.ts`:

```ts
import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [/* ... */],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(config) {
    const { mergeConfig } = await import('vite');
    return mergeConfig(config, {
      resolve: {
        alias: {
          '@tu-scope/button': path.resolve(
            __dirname,
            '../../../packages/components/button/src/index.ts'
          ),
        },
      },
    });
  },
};
export default config;
```

### Paso 3: Crear Historias del Button

Crear `apps/docs/src/stories/Button.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@tu-scope/button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'radio', options: ['primary', 'secondary'] },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Botón Primario',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Botón Secundario',
  },
};
```

---

## Sistema de Tematización: Hoja de Ruta e Implementación

### 1. Estructura del Proyecto y Definición de Temas

**a. Crear Directorio del Sistema de Temas**
- Agregar: `packages/themes/`
- Subdirectorios: `default/`, `utils/`

**b. Definir Interfaz de Tema**

```ts
export interface Theme {
  colors: {
    primary: string[];
    secondary: string[];
    tertiary: string[];
    success: string[];
    warning: string[];
    error: string[];
    info: string[];
  };
}
```

### 2. Implementación del Proveedor de Temas

```tsx
// packages/themes/utils/ThemeProvider.tsx
import React, { createContext, useContext } from 'react';
import { Theme } from '../Theme';

const ThemeContext = createContext<Theme | undefined>(undefined);

export const ThemeProvider: React.FC<{ theme: Theme; children: React.ReactNode }> = 
  ({ theme, children }) => (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
};
```

### 3. Integración de Componentes

Refactorizar componentes para usar tema:

```tsx
const { colors } = useTheme();
<button style={{ background: colors.primary[500] }}>Haz clic</button>
```

### 4. Uso en App

```tsx
import { ThemeProvider } from '@tu-scope/themes/utils/ThemeProvider';
import { atixTheme } from '@tu-scope/themes/default/atix';

<ThemeProvider theme={atixTheme}>
  <App />
</ThemeProvider>
```

---

## Cómo Usar un Tema Personalizado en Tu App

Si estás usando esta librería en tu aplicación y quieres tu propio tema:

### 1. Instalar la Librería

```bash
pnpm add @tu-scope/components @tu-scope/themes
```

### 2. Crear Tu Objeto de Tema

```ts
// src/theme/miTema.ts
import type { Theme } from '@tu-scope/themes';

export const miTema: Theme = {
  colors: {
    primary: ['#001F3F', '#003366', '#00509E', '#0074D9', '#339CFF', '#66B2FF', '#99CCFF', '#CCE6FF'],
    secondary: ['#FFDC00', '#FFE066', '#FFF3BF', '#FFF9E3', '#FFFBEA', '#FFFDF2', '#FFFFF8', '#FFFFFC'],
    tertiary: ['#2ECC40', '#51D88A', '#A3E635', '#D9F99D', '#F0FDF4', '#F7FEE7', '#ECFDF5', '#F0FDF4'],
    success: ['#28a745', '#51cf66', '#69db7c', '#b2f2bb', '#d3f9d8', '#e6fcf5', '#f8f9fa', '#f1f3f5'],
    warning: ['#ffc107', '#ffe066', '#fff3bf', '#fff9db', '#fffbe6', '#fffdf2', '#fffef8', '#fffffc'],
    error: ['#dc3545', '#ff6b6b', '#ffa8a8', '#ffe3e3', '#fff5f5', '#fff0f0', '#fff8f8', '#fffafa'],
    info: ['#17a2b8', '#63e6be', '#a5d8ff', '#d0ebff', '#e3fafc', '#f1f3f5', '#f8f9fa', '#f1f3f5'],
  },
};
```

### 3. Envolver Tu App

```tsx
import { ThemeProvider } from '@tu-scope/themes';
import { miTema } from './theme/miTema';

function App() {
  return (
    <ThemeProvider theme={miTema}>
      {/* tu app aquí */}
    </ThemeProvider>
  );
}
```

### Notas Importantes

- **NO necesitas modificar el código fuente de la librería**
- **NO necesitas agregar tu tema a la carpeta themes de la librería**
- Solo necesitas coincidir con la interfaz `Theme`
- Mantén tu archivo de tema en tu código base de app

### Estructura de Proyecto de Ejemplo

```
mi-app/
├── src/
│   ├── theme/
│   │   └── miTema.ts
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── ...
```

### Consejos para Temas Personalizados

- **Seguir la estructura:** Tu objeto de tema debe coincidir con la interfaz `Theme`
- **Arreglos de colores:** Cada color debe ser un arreglo de tonos
- **Seguridad de tipos:** TypeScript detectará campos faltantes 