import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  base: "./",
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "react",
  },
  build: {
    outDir: fileURLToPath(new URL("../../../dist/webui", import.meta.url)),
    emptyOutDir: true,
    rollupOptions: {
      onwarn(warning, defaultHandler) {
        if (
          warning.code === "INVALID_ANNOTATION" &&
          warning.id?.includes("/node_modules/zod/") // https://github.com/colinhacks/zod/issues/6619
        ) {
          return;
        }
        defaultHandler(warning);
      },
    },
  },
});
