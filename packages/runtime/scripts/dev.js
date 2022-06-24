import { build } from "esbuild";
import { exportAsString } from "./exportAsString.js";

build({
  entryPoints: ["src/index.ts"],
  outfile: "dist/bundle.js",
  format: "esm",
  bundle: true,
  // minify: true,
  watch: {
    onRebuild(error) {
      if (error) {
        console.error("build failed", error);
        return;
      }
      console.log("build succeeded");
      exportAsString("dist/bundle.js", "dist/index.js", "dist/index.d.ts");
    },
  },
}).then(() => {
  console.log("build succeeded");
  exportAsString("dist/bundle.js", "dist/index.js", "dist/index.d.ts");
});
