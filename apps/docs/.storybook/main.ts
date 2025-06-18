import type { StorybookConfig } from "@storybook/react-vite";

import { join, dirname } from "path";
import path from "path";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): string {
  return dirname(require.resolve(join(value, "package.json")));
}
const config: StorybookConfig = {
  stories: ["../src/stories/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    getAbsolutePath("@chromatic-com/storybook"),
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-vitest"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },
  async viteFinal(config) {
    const { mergeConfig } = await import("vite");

    return mergeConfig(config, {
      css: {
        modules: {
          localsConvention: "camelCase",
          generateScopedName: "[name]__[local]___[hash:base64:5]",
        },
      },
      resolve: {
        alias: {
          "@poc/button": path.resolve(
            __dirname,
            "../../../packages/button/src/index.ts",
          ),
          "@poc/themes": path.resolve(
            __dirname,
            "../../../packages/themes/index.ts",
          ),
        },
      },
    });
  },
};
export default config;
