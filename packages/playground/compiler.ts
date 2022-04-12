import { rollup } from "rollup";
import { transform, availablePresets } from "@babel/standalone";

import type { Plugin } from "rollup";

export type ResolveFile = (fileName: string) => Promise<string | null>;

const file = "bundle.js";
const format = "iife";
const { env, react } = availablePresets;
const babelOptions = { presets: [env, react] };

export async function compile(source: string, resolveFile: ResolveFile): Promise<string> {
  const bundle = await rollup({
    input: "source",
    treeshake: false,
    plugins: [fs(source, resolveFile), babel()],
    // output: [{ file, format }],
  });

  const { output } = await bundle.generate({ file, format });
  return output[0].code;
}

const fs = (source: string, resolveFile: ResolveFile): Plugin => ({
  name: "fs plugin",
  async load(id) {
    if (id === "source") return source;
    return await resolveFile(id);
  },
});

const babel = (): Plugin => ({
  name: "babel plugin",
  transform(source) {
    const { code } = transform(source, babelOptions);
    return code;
  },
});
