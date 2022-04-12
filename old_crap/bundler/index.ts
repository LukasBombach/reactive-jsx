import { rollup } from "rollup";

import { /* pluginShowCode, */ pluginBundle } from "./plugin";

export async function bundle(source: string, runtime: string) {
  const file = "bundle.js";
  const format = "iife";

  const bundle = await rollup({
    input: "playground",
    treeshake: false,
    plugins: [pluginBundle(source, runtime)],
    output: [{ file, format }],
  });

  const { output } = await bundle.generate({ file, format });

  const [{ code }] = output;
  return code;
}

/* export async function showCode(source: string) {
  const file = "bundle.js";
  const format = "es";

  const bundle = await rollup({
    input: "playground",
    treeshake: false,
    plugins: [pluginShowCode(source)],
    output: [{ file, format }],
  });

  const { output } = await bundle.generate({ file, format });
  const [{ code }] = output;
  return code;
}
 */
