import { rollup } from "rollup";
import { transpile } from "@reactive-jsx/transpiler";

import type { Plugin } from "rollup";

const replPlugin: (source: string) => Plugin = source => ({
  name: "reactive-jsx-repl",
  resolveId(id) {
    if (id === "virtual-module") {
      return id;
    }
    return null;
  },
  load(id) {
    if (id === "virtual-module") {
      return source;
    }
    return null;
  },
  transform(source) {
    return transpile(source) || "";
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
