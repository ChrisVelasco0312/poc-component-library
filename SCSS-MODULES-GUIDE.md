# SCSS Modules Guide for POC Component Library

## Overview

This component library uses SCSS modules for styling. Each component has its own SCSS module file that provides scoped styles, preventing CSS conflicts and ensuring maintainability.

## Setup (Already Done)

The following configuration has been set up for you:

1. **SCSS Support**: `sass` package installed in both component packages and docs app
2. **Vite Configuration**: CSS modules configured with camelCase naming
3. **TypeScript Support**: CSS module declarations for proper type checking
4. **Storybook Integration**: Configured to handle CSS modules properly

## Creating a New Component with SCSS Modules

### 1. Component Structure

```
packages/components/your-component/
├── src/
│   ├── YourComponent.tsx
│   ├── YourComponent.module.scss
│   ├── index.ts
│   └── styles.d.ts
├── package.json
├── vite.config.ts
└── tsconfig.json
```

### 2. SCSS Module File

Create `YourComponent.module.scss`:

```scss
// Base component styles
.yourComponent {
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

// Variants
.primary {
  background-color: #3b82f6;
  color: white;
}

.secondary {
  background-color: #f3f4f6;
  color: #374151;
}

// Sizes
.small {
  padding: 8px 12px;
  font-size: 14px;
}

.large {
  padding: 16px 24px;
  font-size: 18px;
}
```

### 3. Component Implementation

```tsx
import React from 'react';
import styles from './YourComponent.module.scss';

export interface YourComponentProps {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'large';
  className?: string;
  children: React.ReactNode;
}

export const YourComponent = ({ 
  variant = 'primary', 
  size = 'medium', 
  className, 
  children,
  ...props 
}: YourComponentProps) => {
  const variantClass = styles[variant];
  const sizeClass = styles[size];
  
  const combinedClassName = [
    styles.yourComponent,
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

### 4. Index File

Update `src/index.ts`:

```ts
import './YourComponent.module.scss';
export * from './YourComponent';
```

### 5. TypeScript Declarations

The `styles.d.ts` file is the same for all components:

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

### 6. Package Configuration

Your `package.json` should include:

```json
{
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/your-component.es.js"
      },
      "require": {
        "types": "./dist/index.d.ts",
        "default": "./dist/your-component.umd.js"
      }
    },
    "./dist/your-component.css": "./dist/your-component.css"
  }
}
```

### 7. Vite Configuration

Copy this `vite.config.ts`:

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
      name: 'YourComponent',
      formats: ['es', 'umd'],
      fileName: (format) => `your-component.${format}.js`,
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

## Storybook Integration

### 8. Storybook Preview Configuration

Add your component CSS to `apps/docs/.storybook/preview.ts`:

```ts
import type { Preview } from '@storybook/react';

// Auto-import all component CSS files
import '@poc/button/dist/button.css';
import '@poc/your-component/dist/your-component.css'; // Add your new component here

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
```

### 9. Stories File

Create `apps/docs/src/stories/YourComponent.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { YourComponent } from '@poc/your-component';

// Note: CSS is automatically imported via Storybook preview config

const meta = {
  title: 'Components/YourComponent',
  component: YourComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'radio', options: ['primary', 'secondary'] },
    size: { control: 'radio', options: ['small', 'large'] },
  },
} satisfies Meta<typeof YourComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Component',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Component',
  },
};
```

## Best Practices

1. **Naming Convention**: Use kebab-case for CSS class names in SCSS, they'll be converted to camelCase in TypeScript
2. **Scoping**: Keep styles scoped to the component - avoid global styles
3. **Modularity**: Create separate SCSS files for different concerns (base, variants, animations)
4. **Variables**: Use SCSS variables for consistent theming
5. **Nesting**: Don't nest more than 3 levels deep
6. **Performance**: Use CSS modules for component-specific styles, keep global styles minimal

## Common Patterns

### Conditional Classes
```tsx
const className = [
  styles.base,
  isActive && styles.active,
  isDisabled && styles.disabled,
  props.className
].filter(Boolean).join(' ');
```

### Theme Variables
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

### Responsive Design
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

This setup ensures that:
- Styles are properly scoped to components
- CSS is bundled with the component
- TypeScript provides proper type checking
- Storybook displays styles correctly
- New components can be easily created following the same pattern 