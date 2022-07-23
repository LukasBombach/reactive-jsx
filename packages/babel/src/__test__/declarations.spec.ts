import { getProgram } from "./getProgram";
import { visit } from "./visit";
import { getDeclarations } from "../declarations";

describe("declarations", () => {
  test("x", async () => {
    await visit("let count = 0; const Button = () => <button onClick={() => count++} />;", {
      Program: path => {
        const declarations = getDeclarations(path);

        console.log(declarations.map(b => b.path.toString()));

        expect(declarations).toHaveLength(1);
      },
    });
  });
});
