import { build } from "esbuild";

build({
  entryPoints: ["src/plugin.ts"],
  outfile: "dist/plugin.js",
  format: "cjs",
}).then(() => {
  console.log("build succeeded");
});
