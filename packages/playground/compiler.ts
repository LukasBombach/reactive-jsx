import { rollup } from "rollup";
import { transform, availablePresets } from "@babel/standalone";

import type { Plugin, OutputOptions } from "rollup";

export type ResolveFile = (fileName: string) => Promise<string | null>;

const sourceFileName = "source.js";
const outputOptions: OutputOptions = { file: "bundle.js", format: "iife" };
const babelOptions = { presets: [availablePresets.env, availablePresets.react] };

export async function compile(source: string, resolveFile: ResolveFile): Promise<string> {
  const bundle = await rollup({
    input: sourceFileName,
    plugins: [fs(source, resolveFile), babel()],
  });
  const { output } = await bundle.generate(outputOptions);
  return output[0].code;
}

const fs = (source: string, resolveFile: ResolveFile): Plugin => ({
  name: "fs",
  async load(id) {
    if (id === sourceFileName) return source;
    return await resolveFile(id);
  },
});

const babel = (): Plugin => ({
  name: "babel",
  transform: source => transform(source, babelOptions).code,
});
