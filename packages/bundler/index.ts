import { rollup } from "rollup";

import { /* pluginShowCode, */ pluginBundle } from "./plugin";

export async function bundle(source: string) {
  const file = "bundle.js";

  const bundle = await rollup({
    input: "playground",
    treeshake: false,
    plugins: [pluginBundle(source)],
    output: [{ file, format: "es" }],
  });

  const { output } = await bundle.generate({ file, format: "es" });
  console.log(output);

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
