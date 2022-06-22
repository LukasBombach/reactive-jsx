import { spawn } from "child_process";
import { emitKeypressEvents } from "readline";
import { build } from "esbuild";
import chalk from "chalk";

emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on("keypress", (_str, key) => {
  if (key.name === "q") {
    process.exit();
  }
});

build({
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.js",
  bundle: true,
  watch: {
    onRebuild(error) {
      if (error) {
        console.error("watch build failed:", error);
        return;
      }
      executeOutput();
    },
  },
}).then(() => {
  executeOutput();
});

function executeOutput() {
  const process = spawn("node", ["dist/index.js"], { stdio: "inherit" });
  process.on("close", () => console.log(chalk.dim("Press"), "q", chalk.dim("to quit")));
}
