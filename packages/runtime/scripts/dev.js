import { spawn } from "child_process";
import { build } from "esbuild";

build({
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.js",
  bundle: true,
  watch: {
    onRebuild(error) {
      if (error) console.error("watch build failed:", error);
      else spawn("node", ["dist/index.js"], { stdio: "inherit" });
    },
  },
}).then(() => {
  spawn("node", ["dist/index.js"], { stdio: "inherit" });
});
