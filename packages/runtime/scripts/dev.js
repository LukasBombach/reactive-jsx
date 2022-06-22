import { build } from "esbuild";

build({
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.js",
  format: "esm",
  bundle: true,
  minify: true,
  watch: {
    onRebuild(error) {
      if (error) console.error("build failed", error);
      else console.log("build succeeded");
    },
  },
}).then(() => {
  console.log("build succeeded");
});
