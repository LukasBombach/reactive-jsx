import { rollup } from "rollup";

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
      return source;
    }
    return null;
  },
});

export async function bundle(source: string) {
  const file = "bundle.js";
  const format = "es";

  const bundle = await rollup({
    input: "virtual-module",
    plugins: [replPlugin(source)],
    output: [{ file, format }],
  });

  const { output } = await bundle.generate({ file, format });
  const [{ code }] = output;
  return code;
}
