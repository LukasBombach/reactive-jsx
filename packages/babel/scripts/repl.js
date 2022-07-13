const { emitKeypressEvents } = require("readline");
const { promises: fs } = require("fs");
const chokidar = require("chokidar");
const { transformAsync } = require("@babel/core");
const { build } = require("esbuild");
const chalk = require("chalk");

/* emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on("keypress", (_str, key) => {
  if (key.name === "q") process.exit();
}); */

const pluginSrc = "src/plugin.ts";
const pluginDist = "dist/plugin.js";
const replSrc = "src/repl.tsx";

chokidar.watch([pluginSrc]).on("all", async () => {
  await build({
    entryPoints: [pluginSrc],
    outfile: pluginDist,
    format: "cjs",
  });
});

chokidar.watch([pluginDist, replSrc]).on("all", async (event, path) => {
  try {
    const reactiveJsxPlugin = await import(`../${pluginDist}?cachebust=${Date.now()}`).then(m => m.default);
    const source = await fs.readFile(replSrc, "utf-8");

    console.log("\033[2J");

    const transformed = await transformAsync(source, {
      filename: "repl.tsx",
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
            pragma: "rjsx.createElement",
            pragmaFrag: "rjsx.Fragment",
          },
        ],
        "@babel/preset-typescript",
      ],
      plugins: [reactiveJsxPlugin],
    });

    //console.log("trigger", event, path);
    // console.log("\n");
    console.log(transformed.code);
  } catch (error) {
    console.error(error);
  }
  // console.log("\n");
  // console.log(chalk.dim("> Press"), "q", chalk.dim("to quit", "\n"));
});
