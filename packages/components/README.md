# @ChrisVelasco0312/poc-ui-components

Complete component library for POC project.

## Installation

```bash
npm install @ChrisVelasco0312/poc-ui-components @ChrisVelasco0312/poc-ui-themes
```

## Usage

```tsx
import { Button } from '@ChrisVelasco0312/poc-ui-components';
import { ThemeProvider, atixTheme } from '@ChrisVelasco0312/poc-ui-themes';

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
- @ChrisVelasco0312/poc-ui-themes for full theming functionality

## Development

This package is part of the POC component library monorepo. 