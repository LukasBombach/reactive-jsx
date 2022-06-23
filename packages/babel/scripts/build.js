import { build } from "esbuild";

build({
  entryPoints: ["src/index.ts"],
  outfile: "dist/bundle.js",
  format: "esm",
}).then(() => {
  console.log("build succeeded");
});
