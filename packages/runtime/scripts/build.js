const { build } = require("esbuild");
const exportAsString = require("./exportAsString.js");

build({
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.js",
  format: "cjs",
  bundle: true,
  minify: true,
}).then(() => {
  exportAsString("dist/index.js", "dist/as-string.js", "dist/as-string.d.ts");
});
