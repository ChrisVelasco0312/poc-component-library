import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "path";
import { readFileSync, writeFileSync } from "fs";

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ["src/**/*"],
      exclude: ["**/*.stories.*", "**/*.test.*"]
    }),
    {
      name: 'css-injector',
      writeBundle(options, bundle) {
        const outDir = options.dir || 'dist';
        
        // Find CSS and JS files
        const cssFiles = Object.keys(bundle).filter(f => f.endsWith('.css'));
        const jsFiles = Object.keys(bundle).filter(f => f.endsWith('.js'));
        
        // Inject CSS imports into each JS file
        jsFiles.forEach(jsFile => {
          const jsPath = resolve(outDir, jsFile);
          let content = readFileSync(jsPath, 'utf-8');
          
          cssFiles.forEach(cssFile => {
            const cssImport = `import "./${cssFile}";\n`;
            if (!content.includes(cssImport)) {
              content = cssImport + content;
            }
          });
          
          writeFileSync(jsPath, content);
        });
      }
    }
  ],
  css: {
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: '[name]__[local]___[hash:base64:5]',
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "POCComponents",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "esm" : format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
        },
      },
    },
    cssCodeSplit: false,
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@ChrisVelasco0312/poc-ui-button": resolve(__dirname, "../button/src"),
      // Future components will be added here:
      // "@poc/input": resolve(__dirname, "../input/src"),
    },
  },
}); 