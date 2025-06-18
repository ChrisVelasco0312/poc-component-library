# @poc/components

Complete component library for POC project.

## Installation

```bash
npm install @poc/components @poc/themes
```

## Usage

```tsx
import { Button } from '@poc/components';
import { ThemeProvider, atixTheme } from '@poc/themes';

function App() {
  return (
    <ThemeProvider theme={atixTheme}>
      <Button variant="primary">Hello World</Button>
    </ThemeProvider>
  );
}
```

## Components

- **Button**: Primary UI button component with theme integration

## Requirements

- React 19.1.0 or later
- @poc/themes for full theming functionality

## Development

This package is part of the POC component library monorepo. 