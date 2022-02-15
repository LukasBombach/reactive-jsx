import { rollup } from "rollup";
import { transpile } from "transpiler";

import type { Plugin } from "rollup";

const replPlugin: (source: string) => Plugin = source => ({
  name: "reactive-jsx-repl",
  async resolveId(id) {
    if (id === "virtual-module") {
      return id;
    }
    return null;
  },
  async load(id) {
    if (id === "virtual-module") {
      return transpile(source) || "";
    }
    return null;
  },
});

export async function bundle(source: string) {
  const file = "bundle.js";
  const format = "es";

  const bundle = await rollup({
    input: "virtual-module",
    treeshake: false,
    plugins: [replPlugin(source)],
    output: [{ file, format }],
  });

  const { output } = await bundle.generate({ file, format });
  const [{ code }] = output;
  return code;
}
