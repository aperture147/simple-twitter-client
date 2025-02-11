import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"], // CommonJS & ESM support
  dts: true, // Generate TypeScript declaration files
  sourcemap: true,
  clean: true
});