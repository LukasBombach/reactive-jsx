import { build } from "esbuild";

build({
  entryPoints: ["src/plugin.ts"],
  outfile: "dist/plugin.js",
  format: "esm",
}).then(() => {
  console.log("build succeeded");
});
