import { visit } from "./visit";
import { getDeclarations } from "../declarations";
import "./jest.extend";

describe("declarations", () => {
  test("x", async () => {
    await visit("let count = 0; const Button = () => <button onClick={() => count++} />;", {
      Program: path => {
        const declarations = getDeclarations(path);
        expect(declarations).toMatchSourceCode(["count = 0"]);
      },
    });
  });
});
