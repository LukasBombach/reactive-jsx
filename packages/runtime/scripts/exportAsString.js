import { promises as fs } from "fs";
import { resolve } from "path";

async function exportAsString() {
  const pathToSource = resolve("dist", "bundle.js");
  const pathToGeneratedFile = resolve("dist", "index.js");
  const pathToGeneratedDefs = resolve("dist", "index.d.ts");
  const sourceCode = await fs.readFile(pathToSource, "utf-8");
  const generatedCode = `export default ${JSON.stringify(sourceCode)};`;
  await fs.writeFile(pathToGeneratedFile, generatedCode, "utf-8");
  await fs.writeFile(pathToGeneratedDefs, "declare const runtime: string; export default runtime;", "utf-8");
}

exportAsString();
