import { promises as fs } from "fs";
import { resolve } from "path";

async function exportAsString() {
  const pathToSource = resolve("dist", "index.modern.js");
  const pathToGeneratedFile = resolve("dist", "index.modern.asStr.js");
  const sourceCode = await fs.readFile(pathToSource, "utf-8");
  const generatedCode = `module.exports = ${JSON.stringify(sourceCode)};`;
  await fs.writeFile(pathToGeneratedFile, generatedCode, "utf-8");
}

exportAsString();
