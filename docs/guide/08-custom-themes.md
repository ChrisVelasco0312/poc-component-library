# Phase 7: Creating Custom Themes

This section shows how users of your component library can create and use their own custom themes.

## For Library Users: Custom Theme Implementation

If you are using this component library in your own application and want to apply your own theme, follow these steps.

## Step 1: Install Required Packages

```bash
# Install both components and themes packages
npm install @poc/button @poc/themes
# or
pnpm add @poc/button @poc/themes
# or
yarn add @poc/button @poc/themes
```

## Step 2: Create Your Custom Theme

In your application codebase (not in the library), define your theme object matching the `Theme` interface:

### Basic Custom Theme

Create `src/theme/myTheme.ts`:

```typescript
import type { Theme } from "@poc/themes";

export const myTheme: Theme = {
  colors: {
    primary: [
      "#1a1a2e", // 0 - Darkest
      "#16213e",
      "#0f3460", 
      "#533483", // 3 - Main purple
      "#7209b7",
      "#a663cc",
      "#d4addd",
      "#f1c6e7", // 7 - Lightest
    ],
    secondary: [
      "#2c3e50",
      "#34495e",
      "#3b5371",
      "#465e85", // 3 - Main
      "#566998",
      "#6975ab",
      "#7c80be",
      "#8f8bd1",
    ],
    tertiary: [
      "#e67e22",
      "#f39c12",
      "#f1c40f",
      "#f7dc6f", // 3 - Main yellow
      "#f8e9a0",
      "#faf0c3",
      "#fcf7e6",
      "#fefcf3",
    ],
    success: [
      "#27ae60",
      "#2ecc71",
      "#58d68d",
      "#7dcea0", // 3 - Main
      "#a2d9ce",
      "#c7e9dc",
      "#ebf5f0",
      "#f4faf7",
    ],
    warning: [
      "#e67e22",
      "#f39c12",
      "#f7c531",
      "#f8d64e", // 3 - Main
      "#fae876",
      "#fcf3a3",
      "#fefbd0",
      "#fffef7",
    ],
    error: [
      "#c0392b",
      "#e74c3c",
      "#ec7063",
      "#f1948a", // 3 - Main
      "#f5b7b1",
      "#f9d9d8",
      "#fdeaea",
      "#fef5f5",
    ],
    info: [
      "#2980b9",
      "#3498db",
      "#5dade2",
      "#85c1e9", // 3 - Main
      "#aed6f1",
      "#d6eaf8",
      "#ebf5fb",
      "#f4f9fd",
    ],
    neutral: [
      "#2c3e50",
      "#34495e",
      "#5d6d7e",
      "#85929e", // 3 - Main gray
      "#aab7b8",
      "#d5dbdb",
      "#eaeded",
      "#f7f9f9",
    ],
  },
  // Optional: Add custom typography
  typography: {
    fontFamily: {
      sans: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      serif: '"Merriweather", "Georgia", serif',
      mono: '"JetBrains Mono", "Fira Code", monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem', 
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  // Optional: Add custom spacing
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  // Optional: Add custom border radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    full: '9999px',
  },
};
```

### Corporate Brand Theme

For corporate applications, you might create a more specific theme:

```typescript
import type { Theme } from "@poc/themes";

export const corporateTheme: Theme = {
  colors: {
    // Brand colors based on corporate identity
    primary: [
      "#003366", // Navy blue - darkest
      "#004080",
      "#0066cc",
      "#0080ff", // 3 - Main brand blue
      "#3399ff",
      "#66b3ff",
      "#99ccff",
      "#cce6ff", // 7 - Lightest
    ],
    secondary: [
      "#2d3748", // Professional gray
      "#4a5568",
      "#718096",
      "#a0aec0", // 3 - Main gray
      "#cbd5e0",
      "#e2e8f0",
      "#edf2f7",
      "#f7fafc",
    ],
    tertiary: [
      "#744210", // Warm accent
      "#975a16",
      "#b69e65",
      "#d69e2e", // 3 - Main gold
      "#ecc94b",
      "#f6e05e",
      "#faf089",
      "#fffff0",
    ],
    success: ["#22543d", "#2f855a", "#38a169", "#48bb78", "#68d391", "#9ae6b4", "#c6f6d5", "#f0fff4"],
    warning: ["#744210", "#975a16", "#b7791f", "#d69e2e", "#ecc94b", "#f6e05e", "#faf089", "#fffff0"],
    error: ["#742a2a", "#9b2c2c", "#c53030", "#e53e3e", "#f56565", "#feb2b2", "#fed7d7", "#fef5f5"],
    info: ["#2a4365", "#2c5282", "#2d3748", "#3182ce", "#4299e1", "#63b3ed", "#90cdf4", "#ebf8ff"],
    neutral: ["#1a202c", "#2d3748", "#4a5568", "#718096", "#a0aec0", "#cbd5e0", "#e2e8f0", "#f7fafc"],
  },
  typography: {
    fontFamily: {
      sans: '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      serif: '"IBM Plex Serif", "Georgia", serif',
      mono: '"IBM Plex Mono", "Consolas", monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    full: '9999px',
  },
};
```

## Step 3: Apply Your Theme in Your App

### React App Integration

In your app's root component (e.g., `App.tsx` or `main.tsx`):

```tsx
import React from 'react';
import { ThemeProvider } from '@poc/themes';
import { myTheme } from './theme/myTheme';
import { Button } from '@poc/button';

function App() {
  return (
    <ThemeProvider theme={myTheme}>
      <div className="App">
        <h1>My App with Custom Theme</h1>
        <Button variant="primary">Custom Themed Button</Button>
        <Button variant="secondary">Secondary Button</Button>
      </div>
    </ThemeProvider>
  );
}

export default App;
```

### Next.js Integration

For Next.js apps, wrap your app in `pages/_app.tsx`:

```tsx
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@poc/themes';
import { myTheme } from '../theme/myTheme';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={myTheme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
```

Or in the new App Router `app/layout.tsx`:

```tsx
import { ThemeProvider } from '@poc/themes';
import { myTheme } from '../theme/myTheme';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={myTheme}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

## Step 4: Dynamic Theme Switching

Implement runtime theme switching for user preferences:

```tsx
import React, { useState } from 'react';
import { ThemeProvider, atixTheme, bancoWTheme } from '@poc/themes';
import { myTheme } from './theme/myTheme';
import { Button } from '@poc/button';

const themes = {
  atix: atixTheme,
  bancoW: bancoWTheme,
  custom: myTheme,
};

function App() {
  const [currentTheme, setCurrentTheme] = useState<keyof typeof themes>('custom');

  return (
    <ThemeProvider theme={themes[currentTheme]}>
      <div className="App">
        <header>
          <h1>Multi-Theme App</h1>
          <div>
            <label>Choose Theme: </label>
            <select 
              value={currentTheme} 
              onChange={(e) => setCurrentTheme(e.target.value as keyof typeof themes)}
            >
              <option value="custom">My Custom Theme</option>
              <option value="atix">Atix Theme</option>
              <option value="bancoW">Banco W Theme</option>
            </select>
          </div>
        </header>
        
        <main>
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
        </main>
      </div>
    </ThemeProvider>
  );
}
```

## Step 5: Advanced Custom Themes

### Extending Existing Themes

You can extend existing themes rather than creating from scratch:

```typescript
import { atixTheme, type Theme } from '@poc/themes';

export const extendedAtixTheme: Theme = {
  ...atixTheme,
  colors: {
    ...atixTheme.colors,
    // Override just the primary colors
    primary: [
      "#4c1d95", // Purple variant
      "#5b21b6",
      "#6d28d9",
      "#7c3aed", // 3 - Main
      "#8b5cf6",
      "#a78bfa",
      "#c4b5fd",
      "#ddd6fe",
    ],
  },
  // Add custom properties
  spacing: {
    ...atixTheme.spacing,
    '3xl': '4rem',
    '4xl': '6rem',
  },
};
```

### Theme with CSS Variables

For maximum flexibility, you can define themes that map to existing CSS variables:

```typescript
export const cssVariableTheme: Theme = {
  colors: {
    primary: [
      'var(--brand-primary-900)',
      'var(--brand-primary-800)',
      'var(--brand-primary-700)',
      'var(--brand-primary-600)',
      'var(--brand-primary-500)',
      'var(--brand-primary-400)',
      'var(--brand-primary-300)',
      'var(--brand-primary-200)',
    ],
    // ... other colors using CSS variables
  },
  // ... rest of theme
};
```

## Theme Structure Guidelines

### Color Array Structure

Each color array should have 8 values representing different shades:
- **Index 0-2**: Dark shades (for text on light backgrounds)
- **Index 3**: Main/default shade (most commonly used)
- **Index 4-7**: Light shades (for backgrounds, borders)

### Best Practices

1. **Contrast Ratios**: Ensure good contrast between text and background colors
2. **Accessibility**: Test with color blindness simulators
3. **Consistency**: Maintain consistent brightness levels across color families
4. **Semantic Meaning**: Use success (green), warning (yellow), error (red) appropriately

### Theme Validation

You can add runtime validation for your themes:

```typescript
function validateTheme(theme: Theme): boolean {
  // Check that all color arrays have 8 values
  const colorKeys = Object.keys(theme.colors);
  return colorKeys.every(key => 
    Array.isArray(theme.colors[key as keyof typeof theme.colors]) && 
    theme.colors[key as keyof typeof theme.colors].length === 8
  );
}

// Use in your app
if (!validateTheme(myTheme)) {
  console.warn('Theme validation failed');
}
```

## Testing Your Custom Theme

1. **Visual Testing**: Check all component variants with your theme
2. **Contrast Testing**: Use browser dev tools to check contrast ratios
3. **Device Testing**: Test on different screen sizes and devices
4. **Accessibility Testing**: Use screen readers and keyboard navigation

## Notes for Custom Themes

- **You do NOT need to modify the library source code**
- **You do NOT need to add your theme to the library's themes folder**
- **Your theme stays in your application codebase**
- **Multiple themes can coexist and be switched dynamically**
- **All library components automatically pick up your theme variables**

---

## Navigation

**[← Previous: Theming System](./07-theming-system.md)** | **[Next: Unified Package →](./09-unified-package.md)** 