import { rollup } from "rollup";
import { transform, availablePresets } from "@babel/standalone";
import { insertImports, reactive } from "@reactive-jsx/babel";

import type { Plugin, OutputOptions } from "rollup";

export type ResolveFile = (fileName: string) => Promise<string | null>;

const sourceFileName = "app.js";
const outputOptions: OutputOptions = { file: "bundle.js", format: "iife" };

const babelOptions = {
  presets: [
    [
      availablePresets.env,
      {
        modules: false,
        targets: {
          firefox: "97",
        },
      },
    ],
    [
      availablePresets.react,
      {
        pragma: "ReactiveJsx.element",
        pragmaFrag: "ReactiveJsx.fragment",
      },
    ],
  ],
  plugins: [reactive, insertImports],
};

export async function compile(source: string, resolveFile: ResolveFile): Promise<string> {
  const bundle = await rollup({
    input: sourceFileName,
    plugins: [fs(source, resolveFile), babel()],
  });

  const { output } = await bundle.generate(outputOptions);
  await bundle.close();
  return output[0].code;
}

const fs = (source: string, resolveFile: ResolveFile): Plugin => ({
  name: "fs",
  resolveId: id => id,
  load: async id => {
    if (id === sourceFileName) return source;
    return await resolveFile(id);
  },
});

const babel = (): Plugin => ({
  name: "babel",
  transform: source => transform(source, babelOptions).code,
});
