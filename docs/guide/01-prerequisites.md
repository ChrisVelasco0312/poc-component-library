# Prerequisites

This page outlines everything you need to have installed and configured before starting the component library implementation.

## Required Tools

### 1. Node.js & pnpm
- **Node.js**: Version 18 or higher
- **pnpm**: Package manager for better monorepo support

```bash
# Check your Node.js version
node --version

# Install pnpm globally if you don't have it
npm install -g pnpm

# Verify pnpm installation
pnpm --version
```

### 2. Git & GitHub Account
- **Git**: Version control system
- **GitHub Account**: For repository hosting and package publishing

```bash
# Verify Git installation
git --version

# Configure Git (if not already done)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 3. Code Editor
- **VS Code** (recommended) with these extensions:
  - TypeScript and JavaScript Language Features
  - ESLint
  - Prettier
  - Auto Rename Tag
  - Bracket Pair Colorizer

### 4. GitHub Scope
For this guide, we use the **`@poc`** scope which matches the actual project structure. In a real project, you would:
- Use your GitHub username as the scope (e.g., `@yourname`)
- Or use your organization name (e.g., `@yourcompany`)

## Knowledge Prerequisites

You should have basic familiarity with:

- **React**: Components, props, hooks
- **TypeScript**: Basic types and interfaces
- **Node.js**: Package management and npm scripts
- **Git**: Basic version control operations
- **Command Line**: Terminal/command prompt usage

## Optional but Helpful

- **Monorepos**: Understanding of multi-package repositories
- **Build Tools**: Familiarity with Vite, Webpack, or similar
- **CSS**: Modules, custom properties, and modern CSS features
- **Storybook**: Component documentation and testing

## System Requirements

- **Operating System**: Windows, macOS, or Linux
- **Memory**: At least 4GB RAM (8GB recommended)
- **Storage**: 2GB free space for dependencies and build outputs
- **Network**: Stable internet connection for package downloads

## Verification Checklist

Before proceeding, ensure you can run these commands successfully:

```bash
# Check Node.js (should be 18+)
node --version

# Check pnpm (should be 8+)
pnpm --version

# Check Git
git --version

# Test GitHub connection
ssh -T git@github.com
# OR
git ls-remote https://github.com/octocat/Hello-World.git
```

## Troubleshooting

### Node.js Issues
- **Windows**: Use [Node.js installer](https://nodejs.org/) or [nvm-windows](https://github.com/coreybutler/nvm-windows)
- **macOS**: Use [Node.js installer](https://nodejs.org/) or `brew install node`
- **Linux**: Use your package manager or [NodeSource](https://github.com/nodesource/distributions)

### pnpm Issues
- **Installation fails**: Try `npm install -g pnpm --force`
- **Permission errors**: Use `sudo` on macOS/Linux or run as administrator on Windows
- **Alternative**: Use `npm` or `yarn` if pnpm continues to cause issues

### Git/GitHub Issues
- **SSH key setup**: Follow [GitHub's SSH guide](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
- **HTTPS authentication**: Use [Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

---

## Navigation

**[← Back to Index](./index.md)** | **[Next: Monorepo Setup →](./02-monorepo-setup.md)** 