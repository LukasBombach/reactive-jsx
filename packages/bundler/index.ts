import { rollup } from "rollup";
import { transpile } from "@reactive-jsx/transpiler";
import { runtime } from "./runtime_proto";

import type { Plugin } from "rollup";

const replPlugin: (source: string) => Plugin = source => ({
  name: "reactive-jsx-repl",
  resolveId(id) {
    if (["@reactive-jsx/runtime", "playground"].includes(id)) {
      return id;
    }
    return null;
  },
  load(id) {
    if (id === "playground") {
      return source;
    }
    if (id === "@reactive-jsx/runtime") {
      return runtime;
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
    input: "playground",
    treeshake: false,
    plugins: [replPlugin(source)],
    output: [{ file, format }],
  });

  const { output } = await bundle.generate({ file, format });
  const [{ code }] = output;
  return code;
}
