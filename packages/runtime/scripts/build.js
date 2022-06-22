import { build } from "esbuild";

build({
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.js",
  format: "esm",
  bundle: true,
  minify: true,
});
