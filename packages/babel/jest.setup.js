import { build } from "esbuild";

const pluginSrc = "src/plugin.ts";
const pluginDist = "dist/plugin.js";

module.exports = async function () {
  await build({
    entryPoints: [pluginSrc],
    outfile: pluginDist,
    bundle: true,
    format: "cjs",
  });
};
