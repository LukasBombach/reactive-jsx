import { promises as fs } from "fs";
import { resolve } from "path";

export async function exportAsString(input, output, types) {
  const pathToSource = resolve(input);
  const pathToGeneratedFile = resolve(output);
  const pathToGeneratedDefs = resolve(types);
  const sourceCode = await fs.readFile(pathToSource, "utf-8");
  const generatedCode = `export default ${JSON.stringify(sourceCode)};`;
  await fs.writeFile(pathToGeneratedFile, generatedCode, "utf-8");
  await fs.writeFile(pathToGeneratedDefs, "declare const runtime: string; export default runtime;", "utf-8");
}
