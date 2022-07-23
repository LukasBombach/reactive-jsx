import { NodePath } from "@babel/traverse";
import { getProgram } from "./getProgram";
import { visit } from "./visit";
import { getDeclarations } from "../declarations";

expect.addSnapshotSerializer({
  test: val => {
    return val && val.path instanceof NodePath;
  },
  print: val => {
    return val.path.toString();
  },
});

describe("declarations", () => {
  test("x", async () => {
    await visit("let count = 0; const Button = () => <button onClick={() => count++} />;", {
      Program: path => {
        const declarations = getDeclarations(path);

        console.log(declarations.map(b => b.path.toString()));

        expect(declarations).toMatchInlineSnapshot(`
Array [
  count = 0,
  Button = () => <button onClick={() => count++} />,
]
`);
      },
    });
  });
});
