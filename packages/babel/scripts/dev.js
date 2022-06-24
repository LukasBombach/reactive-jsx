import { build } from "esbuild";
import { exportAsString } from "./exportAsString.js";

build({
  entryPoints: ["src/plugin.ts"],
  outfile: "dist/plugin.js",
  format: "esm",
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
