const { spawn } = require("child_process");
const { emitKeypressEvents } = require("readline");
const { build } = require("esbuild");
const chalk = require("chalk");

emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on("keypress", (_str, key) => {
  if (key.name === "q") {
    process.exit();
  }
});

build({
  entryPoints: ["src/repl.ts"],
  outfile: "dist/repl.js",
  bundle: true,
  format: "cjs",
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
  const process = spawn("node", ["dist/repl.js"], { stdio: "inherit" });
  process.on("close", () => console.log(chalk.dim("Press"), "q", chalk.dim("to quit")));
}
