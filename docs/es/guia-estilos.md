# Guía de Módulos SCSS para Librería de Componentes POC

## Resumen

Esta librería de componentes usa módulos SCSS para estilos. Cada componente tiene su propio archivo de módulo SCSS que proporciona estilos con scope, previniendo conflictos de CSS y asegurando mantenibilidad.

## Configuración (Ya Realizada)

La siguiente configuración ha sido establecida para ti:

1. **Soporte SCSS**: Paquete `sass` instalado tanto en paquetes de componentes como en la app docs
2. **Configuración Vite**: Módulos CSS configurados con nomenclatura camelCase
3. **Soporte TypeScript**: Declaraciones de módulos CSS para verificación de tipos apropiada
4. **Integración Storybook**: Configurado para manejar módulos CSS correctamente

## Crear un Nuevo Componente con Módulos SCSS

### 1. Estructura del Componente

```
packages/components/tu-componente/
├── src/
│   ├── TuComponente.tsx
│   ├── TuComponente.module.scss
│   ├── index.ts
│   └── styles.d.ts
├── package.json
├── vite.config.ts
└── tsconfig.json
```

### 2. Archivo de Módulo SCSS

Crear `TuComponente.module.scss`:

```scss
// Estilos base del componente
.tuComponente {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

// Variantes
.primary {
  background-color: #3b82f6;
  color: white;
}

.secondary {
  background-color: #f3f4f6;
  color: #374151;
}

// Tamaños
.small {
  padding: 8px 12px;
  font-size: 14px;
}

.large {
  padding: 16px 24px;
  font-size: 18px;
}
```

### 3. Implementación del Componente

```tsx
import React from 'react';
import styles from './TuComponente.module.scss';

export interface TuComponenteProps {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'large';
  className?: string;
  children: React.ReactNode;
}

export const TuComponente = ({ 
  variant = 'primary', 
  size = 'medium', 
  className, 
  children,
  ...props 
}: TuComponenteProps) => {
  const variantClass = styles[variant];
  const sizeClass = styles[size];
  
  const combinedClassName = [
    styles.tuComponente,
    variantClass,
    sizeClass,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  );
};
```

### 4. Archivo Index

Actualizar `src/index.ts`. Este paso es crucial para asegurar que los estilos de tu componente siempre estén incluidos con el componente.

```ts
// Esta importación es CRUCIAL. Asegura que cuando Vite construye el componente,
// los estilos del módulo SCSS se incluyen en la salida CSS final.
// También hace que los estilos estén disponibles cuando usamos source-aliasing para hot-reloading en Storybook.
import './TuComponente.module.scss';

// Luego, exporta tu componente y cualquier tipo relacionado.
export * from './TuComponente';
```

### 5. Declaraciones TypeScript

El archivo `styles.d.ts` es el mismo para todos los componentes:

```ts
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { [key: string]: string };
  export default classes;
}
```

### 6. Configuración del Paquete

Tu `package.json` debe incluir:

```json
{
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/tu-componente.es.js"
      },
      "require": {
        "types": "./dist/index.d.ts",
        "default": "./dist/tu-componente.umd.js"
      }
    },
    "./dist/tu-componente.css": "./dist/tu-componente.css"
  }
}
```

### 7. Configuración Vite

Copiar este `vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ['src'],
    }),
  ],
  css: {
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: '[name]__[local]___[hash:base64:5]',
    },
  },
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'TuComponente',
      formats: ['es', 'umd'],
      fileName: (format) => `tu-componente.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    cssCodeSplit: false,
  },
});
```

## Integración con Storybook

### 8. Manejo de Estilos en Storybook

**No hay pasos adicionales.**

Debido a que cada paquete de componente es responsable de importar sus propios estilos (como se muestra en el Paso 4), los estilos funcionarán automáticamente en Storybook.

Cuando Storybook está configurado para hot-reloading (creando alias del paquete a su código fuente), Vite procesa el `index.ts` del componente, ve la importación `.scss`, y la maneja correctamente. No necesitas agregar ninguna importación CSS a `.storybook/preview.ts`.

### 9. Archivo de Historias

Crear `apps/docs/src/stories/TuComponente.stories.tsx` como normalmente harías. No se necesita configuración de estilos especial.

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TuComponente } from '@poc/tu-componente';

// Nota: Los estilos son manejados por el propio paquete del componente.

const meta = {
  title: 'Components/TuComponente',
// ...
```

## Mejores Prácticas

1. **Convención de Nomenclatura**: Usar kebab-case para nombres de clases CSS en SCSS, se convertirán a camelCase en TypeScript
2. **Scoping**: Mantener estilos con scope al componente - evitar estilos globales
3. **Modularidad**: Crear archivos SCSS separados para diferentes responsabilidades (base, variantes, animaciones)
4. **Variables**: Usar variables SCSS para tematización consistente
5. **Anidamiento**: No anidar más de 3 niveles de profundidad
6. **Rendimiento**: Usar módulos CSS para estilos específicos de componentes, mantener estilos globales mínimos

## Patrones Comunes

### Clases Condicionales
```tsx
const className = [
  styles.base,
  isActive && styles.active,
  isDisabled && styles.disabled,
  props.className
].filter(Boolean).join(' ');
```

### Variables de Tema
```scss
$primary-color: #3b82f6;
$secondary-color: #6b7280;
$border-radius: 8px;
$transition: all 0.2s ease-in-out;

.component {
  background-color: $primary-color;
  border-radius: $border-radius;
  transition: $transition;
}
```

### Diseño Responsivo
```scss
.component {
  padding: 8px;
  
  @media (min-width: 768px) {
    padding: 16px;
  }
  
  @media (min-width: 1024px) {
    padding: 24px;
  }
}
```

Esta configuración asegura que:
- Los estilos están correctamente con scope a los componentes
- CSS está empaquetado con el componente
- TypeScript proporciona verificación de tipos apropiada
- Storybook muestra los estilos correctamente
- Nuevos componentes pueden ser fácilmente creados siguiendo el mismo patrón 