import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    {
      name: "package-css",
      // Histoire reuses this config; only the library build packages CSS assets.
      apply: (config, env) => env.command === "build" && Boolean(config.build?.lib),
      generateBundle() {
        const emitCss = (directory: string, target: string) => {
          for (const entry of readdirSync(directory, { withFileTypes: true })) {
            const source = join(directory, entry.name);
            const fileName = `${target}/${entry.name}`;
            if (entry.isDirectory()) emitCss(source, fileName);
            else if (entry.name.endsWith(".css")) {
              this.emitFile({ type: "asset", fileName, source: readFileSync(source) });
            }
          }
        };
        emitCss("src/styles", "styles");
        emitCss("src/site", "site");
      },
    },
  ],
  build: {
    lib: {
      entry: { index: "./src/index.ts", fx: "./src/site/fx.ts" },
      name: "ASMProtocolUIKit",
      fileName: (_format, entryName) => `${entryName}.js`,
      formats: ["es"],
    },
    rollupOptions: {
      external: [],
      output: { assetFileNames: "assets/[name].[ext]" },
    },
    minify: false,
  },
});
