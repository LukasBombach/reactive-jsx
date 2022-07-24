import { program } from "./visit";
import { getDeclarations } from "../declarations";
import "./jest.extend";

describe("declarations - direct and derived", () => {
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

  test("x", async () => {
    await program(
      `
      let count = 0;
      let double = count * 2;
      const Button = () => <button onClick={() => count++} />;
    `,
      path => {
        const declarations = getDeclarations(path);
        expect(declarations).toMatchSourceCode(["count = 0", "double = count * 2"]);
      }
    );
  });

  test("x", async () => {
    await program(
      `
      let count = 0;
      let double = count * 2;
      let triple = count * 3;
      const Button = () => <button onClick={() => count++} />;
    `,
      path => {
        const declarations = getDeclarations(path);
        expect(declarations).toMatchSourceCode(["count = 0", "double = count * 2", "triple = count * 3"]);
      }
    );
  });

  test("x", async () => {
    await program(
      `
      let count = 0;
      let double = count * 2;
      let quad = double * 2;
      const Button = () => <button onClick={() => count++} />;
    `,
      path => {
        const declarations = getDeclarations(path);
        expect(declarations).toMatchSourceCode(["count = 0", "double = count * 2", "quad = double * 2"]);
      }
    );
  });

  test("x", async () => {
    await program(
      `
      let count = 0;
      let double = count * 2;
      let quad = double * 2;
      let eightfold = quad * 2;
      const Button = () => <button onClick={() => count++} />;
    `,
      path => {
        const declarations = getDeclarations(path);
        expect(declarations).toMatchSourceCode([
          "count = 0",
          "double = count * 2",
          "quad = double * 2",
          "eightfold = quad * 2",
        ]);
      }
    );
  });
});

describe("declarations - eventHandlers", () => {
  test("y", async () => {
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

  test("y", async () => {
    await program(
      `
      let count = 0;

      function inc() {
        count++;
      }

      const Button = () => <button onClick={inc} />;
    `,
      path => {
        const declarations = getDeclarations(path);
        expect(declarations).toMatchSourceCode(["count = 0"]);
      }
    );
  });

  test("y", async () => {
    await program(
      `
      let count = 0;
      
      const inc = () => count++;

      const Button = () => <button onClick={inc} />;
    `,
      path => {
        const declarations = getDeclarations(path);
        expect(declarations).toMatchSourceCode(["count = 0"]);
      }
    );
  });

  test("y", async () => {
    await program(
      `
      let count1 = 0;
      let count2 = 0;
      
      const inc1 = () => count1++;
      const inc2 = () => count2++;

      const Button = () => <button onMouseEnter={inc1} onMouseLeave={inc2} />;
    `,
      path => {
        const declarations = getDeclarations(path);
        expect(declarations).toMatchSourceCode(["count1 = 0", "count2 = 0"]);
      }
    );
  });

  test("y", async () => {
    await program(
      `
      let count = 0;
      
      const log = () => console.log(count);

      const Button = () => <button onClick={log} />;
    `,
      path => {
        const declarations = getDeclarations(path);
        expect(declarations).toMatchSourceCode([]);
      }
    );
  });

  test("y", async () => {
    await program(
      `
      let count = 0;
      
      function log() {
        console.log(count);
      }

      const Button = () => <button onClick={log} />;
    `,
      path => {
        const declarations = getDeclarations(path);
        expect(declarations).toMatchSourceCode([]);
      }
    );
  });

  test("y", async () => {
    await program(
      `
      let count = 0;
      
      const handleClick = () => inc();
      const inc = () => count++;

      const Button = () => <button onClick={handleClick} />;
    `,
      path => {
        const declarations = getDeclarations(path);
        expect(declarations).toMatchSourceCode(["count = 0"]);
      }
    );
  });

  test("y", async () => {
    await program(
      `
      let count = 0;
      
      const handleClick = () => inc();

      const inc = () => inc2();
      const inc2 = () => count++;

      const Button = () => <button onClick={handleClick} />;
    `,
      path => {
        const declarations = getDeclarations(path);
        expect(declarations).toMatchSourceCode(["count = 0"]);
      }
    );
  });

  test("y", async () => {
    await program(
      `
      let count = 0;
      
      const handleClick = () => inc();

      const inc = () => inc2();
      const inc2 = () => inc3();
      const inc3 = () => count++;

      const Button = () => <button onClick={handleClick} />;
    `,
      path => {
        const declarations = getDeclarations(path);
        expect(declarations).toMatchSourceCode(["count = 0"]);
      }
    );
  });
});
