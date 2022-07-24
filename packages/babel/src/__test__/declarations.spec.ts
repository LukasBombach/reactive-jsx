import { visit } from "./visit";
import { getDeclarations } from "../declarations";
import "./jest.extend";

describe("declarations", () => {
  test("x", async () => {
    await visit(
      `
      let count = 0;
      const Button = () => <button>{count}</button>;
    `,
      {
        Program: path => {
          const declarations = getDeclarations(path);
          expect(declarations).toMatchSourceCode([]);
        },
      }
    );
  });

  test("x", async () => {
    await visit(
      `
      let count = 0;
      const Button = () => <button onClick={() => count++} />;
    `,
      {
        Program: path => {
          const declarations = getDeclarations(path);
          expect(declarations).toMatchSourceCode(["count = 0"]);
        },
      }
    );
  });

  test("x", async () => {
    await visit(
      `
      let count = 0;
      let count2 = 0;
      const Button = () => <button onMouseDown={() => count++} onMouseUp={() => count2++} />;
    `,
      {
        Program: path => {
          const declarations = getDeclarations(path);
          expect(declarations).toMatchSourceCode(["count = 0", "count2 = 0"]);
        },
      }
    );
  });
});
