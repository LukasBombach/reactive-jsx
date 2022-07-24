import { program } from "./visit";
import { getDeclarations } from "../declarations";
import "./jest.extend";

describe("declarations", () => {
  test("x", async () => {
    await program(
      `
      let count = 0;
      const Button = () => <button>{count}</button>;
    `,
      path => {
        const declarations = getDeclarations(path);
        expect(declarations).toMatchSourceCode([]);
      }
    );
  });

  test("x", async () => {
    await program(
      `
      let count = 0;
      const Button = () => <button onClick={() => count++} />;
    `,
      path => {
        const declarations = getDeclarations(path);
        expect(declarations).toMatchSourceCode(["count = 0"]);
      }
    );
  });

  test("x", async () => {
    await program(
      `
      let count = 0;
      let count2 = 0;
      const Button = () => <button onMouseDown={() => count++} onMouseUp={() => count2++} />;
    `,
      path => {
        const declarations = getDeclarations(path);
        expect(declarations).toMatchSourceCode(["count = 0", "count2 = 0"]);
      }
    );
  });
});
