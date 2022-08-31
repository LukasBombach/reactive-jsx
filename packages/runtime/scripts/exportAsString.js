const { promises: fs } = require("fs");
const { resolve } = require("path");

module.exports = async function exportAsString(input, output, types) {
  const pathToSource = resolve(input);
  const pathToGeneratedFile = resolve(output);
  const pathToGeneratedDefs = resolve(types);
  const sourceCode = await fs.readFile(pathToSource, "utf-8");
  const generatedCode = `module.exports = ${JSON.stringify(sourceCode)};`;
  await fs.writeFile(pathToGeneratedFile, generatedCode, "utf-8");
  await fs.writeFile(pathToGeneratedDefs, "declare const runtime: string; export default runtime;", "utf-8");
};
