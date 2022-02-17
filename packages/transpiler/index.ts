import { transform } from "@babel/standalone";
import { insertImports, getProp } from "babel-plugin";

const options = {
  presets: ["env", "react"],
  plugins: [insertImports, getProp],
  ast: true,
};

export function transpile(code: string): string | null {
  return transform(code, options).code || null;
}
