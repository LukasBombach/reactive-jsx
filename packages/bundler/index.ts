import { rollup } from "rollup";

import type { Plugin } from "rollup";

const replPlugin: Plugin = {
  name: "reactive-jsx-repl",
  async resolveId(source) {
    if (source === "virtual-module") {
      return source;
    }
    return null;
  },
  async load(id) {
    if (id === "virtual-module") {
      return 'export default "This is virtual!"';
    }
    return null;
  },
};

export async function bundle() {
  const file = "bundle.js";
  const format = "es";

  const bundle = await rollup({
    input: "virtual-module",
    plugins: [replPlugin],
    output: [{ file, format }],
  });

  const { output } = await bundle.generate({ file, format });
  const [{ code }] = output;
  return code;
}
