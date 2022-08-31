const { build } = require("esbuild");
const exportAsString = require("./exportAsString.js");

build({
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.js",
  format: "esm",
  target: "es2020",
  bundle: true,
  watch: {
    onRebuild(error) {
      if (error) {
        console.error("build failed", error);
        return;
      }
      console.log("build succeeded");
      exportAsString("dist/index.js", "dist/as-string.js", "dist/as-string.d.ts");
    },
  },
}).then(() => {
  console.log("build succeeded");
  exportAsString("dist/index.js", "dist/as-string.js", "dist/as-string.d.ts");
});
