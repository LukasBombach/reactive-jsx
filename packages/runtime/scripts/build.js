import { build } from "esbuild";
import { exportAsString } from "./exportAsString.js";

build({
  entryPoints: ["src/index.ts"],
  outfile: "dist/bundle.js",
  format: "esm",
  bundle: true,
  minify: true,
}).then(() => {
  exportAsString("dist/bundle.js", "dist/index.js", "dist/index.d.ts");
});