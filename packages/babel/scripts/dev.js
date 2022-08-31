const { build } = require("esbuild");

build({
  entryPoints: ["src/plugin.ts"],
  outfile: "dist/plugin.js",
  format: "cjs",
  bundle: true,
  watch: {
    onRebuild(error) {
      if (error) {
        console.error("build failed", error);
        return;
      }
      console.log("build succeeded");
    },
  },
}).then(() => {
  console.log("build succeeded");
});
