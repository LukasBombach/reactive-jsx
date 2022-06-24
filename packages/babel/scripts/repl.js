import { emitKeypressEvents } from "readline";
import { promises as fs } from "fs";
import { resolve } from "path";
import chokidar from "chokidar";
import { transformAsync } from "@babel/core";
import { build, buildSync } from "esbuild";
import chalk from "chalk";

emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on("keypress", (_str, key) => {
  if (key.name === "q") process.exit();
});

const pluginSrc = "src/plugin.ts";
const pluginDist = "dist/plugin.js";
const replSrc = "src/repl.tsx";

chokidar.watch([pluginSrc]).on("all", async () => {
  await build({
    entryPoints: [pluginSrc],
    outfile: pluginDist,
    format: "esm",
  });
});

chokidar.watch([pluginDist, replSrc]).on("all", async (event, path) => {
  console.clear();
  console.log("trigger", event, path);
  try {
    // delete require.cache[require.resolve(`../${pluginDist}`)];
    // const reactiveJsxPlugin = require(`../${pluginDist}`);
    // const reactiveJsxPlugin = resolve(pluginDist);
    const reactiveJsxPlugin = await import(`../${pluginDist}?cachebust=${Date.now()}`).then(m => m.default);
    const source = await fs.readFile(replSrc, "utf-8");

    const transformed = await transformAsync(source, {
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
      plugins: [reactiveJsxPlugin],
    });

    console.log("\n");
    console.log(source);
    console.log("\n--\n\n");
    console.log(transformed.code);
  } catch (error) {
    console.error(error);
  }
  console.log("\n");
  console.log(chalk.dim("> Press"), "q", chalk.dim("to quit", "\n"));
});
