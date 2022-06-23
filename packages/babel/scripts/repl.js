import { emitKeypressEvents } from "readline";
import { promises as fs } from "fs";
import chokidar from "chokidar";
import { transform } from "@babel/core";
import { build } from "esbuild";
import chalk from "chalk";

emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on("keypress", (_str, key) => {
  if (key.name === "q") {
    process.exit();
  }
});

const pluginPath = "src/index.ts";
const replPath = "src/repl.tsx";

let reactiveJsxPlugin = undefined;

chokidar.watch(pluginPath).on("add", buildBabelPlugin).on("change", buildBabelPlugin);
chokidar.watch(replPath).on("add", transpileAndLog).on("change", transpileAndLog);

async function buildBabelPlugin() {
  await build({
    entryPoints: ["src/index.ts"],
    outfile: "dist/bundle.js",
    format: "esm",
  });
  reactiveJsxPlugin = await import("../dist/bundle.js");
  transpileAndLog();
}

async function transpileAndLog() {
  try {
    const original = await fs.readFile(replPath, "utf-8");

    const transformed = transform(original, {
      presets: [
        [
          "@babel/preset-env",
          {
            modules: false,
            targets: {
              firefox: "97",
            },
          },
        ],
        [
          "@babel/preset-react",
          {
            pragma: "rjsx.el",
            pragmaFrag: "rjsx.frag",
          },
        ],
      ],
      plugins: reactiveJsxPlugin ? [reactiveJsxPlugin.default] : [],
    }).code;

    console.clear();
    console.log("\n");
    console.log(original);
    console.log("\n--\n\n");
    console.log(transformed);
  } catch (error) {
    console.clear();
    console.error(error);
  }
  console.log("\n");
  console.log(chalk.dim("Press"), "q", chalk.dim("to quit", "\n"));
}
