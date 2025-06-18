import config from "@poc/eslint-config/react-library.js";

export default [
  ...config,
  {
    ignores: ["dist/**", "node_modules/**", "*.config.js", "*.config.ts"],
  },
]; 