import { transform, availablePresets } from "@babel/standalone";
import { insertImports, getProp } from "babel-plugin";

const options = {
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
        pragma: "ReactiveJsx.el",
        pragmaFrag: "ReactiveJsx.frag",
        useBuiltIns: true,
      },
    ],
  ],
  plugins: [insertImports, getProp],
};

export function transpile(code: string): string | null {
  return transform(code, options).code || null;
}
