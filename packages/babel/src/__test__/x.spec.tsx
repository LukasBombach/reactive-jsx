import { transform } from "@babel/core";
import * as plugin from "../plugin";

function t(source: string): string {
  const result = transform(source, {
    filename: "test.tsx",
    presets: [
      [
        "@babel/preset-env",
        {
          modules: false,
          targets: {
            firefox: "97",
          },
        },
      ],
      [
        "@babel/preset-react",
        {
          pragma: "rjsx.createElement",
          pragmaFrag: "rjsx.Fragment",
        },
      ],
    ],
    plugins: [plugin],
  });

  if (!result?.code) {
    throw new Error("failed to compile code");
  }

  return result.code;
}

test("positive assignment", () => {
  const code = t(`
      const count = 1;
      const Button = () => <button onClick={() => count = count + 1} />
    `);

  expect(code).toMatchInlineSnapshot(`
    "const count = rjsx.value(() => 1, \\"count\\");

    const Button = () => rjsx.createElement(\\"button\\", {
      onClick: () => count.set(() => count.get() + 1)
    });"
  `);
});

test("positive assignment with another number", () => {
  const code = t(`
      const count = 5;
      const Button = () => <button onClick={() => count = count + 5} />
    `);

  expect(code).toMatchInlineSnapshot(`
    "const count = rjsx.value(() => 5, \\"count\\");

    const Button = () => rjsx.createElement(\\"button\\", {
      onClick: () => count.set(() => count.get() + 5)
    });"
  `);
});

test("negative assignment", () => {
  const code = t(`
      const count = 1;
      const Button = () => <button onClick={() => count = count - 1} />
    `);

  expect(code).toMatchInlineSnapshot(`
    "const count = rjsx.value(() => 1, \\"count\\");

    const Button = () => rjsx.createElement(\\"button\\", {
      onClick: () => count.set(() => count.get() - 1)
    });"
  `);
});

test("negative assignment with another number", () => {
  const code = t(`
      const count = 5;
      const Button = () => <button onClick={() => count = count - 5} />
    `);

  expect(code).toMatchInlineSnapshot(`
    "const count = rjsx.value(() => 5, \\"count\\");

    const Button = () => rjsx.createElement(\\"button\\", {
      onClick: () => count.set(() => count.get() - 5)
    });"
  `);
});

test("positive update", () => {
  const code = t(`
      const count = 1;
      const Button = () => <button onClick={() => count++} />
    `);

  expect(code).toMatchInlineSnapshot(`
    "const count = rjsx.value(() => 1, \\"count\\");

    const Button = () => rjsx.createElement(\\"button\\", {
      onClick: () => count.set(() => count.get() + 1)
    });"
  `);
});

test("negative update", () => {
  const code = t(`
      const count = 1;
      const Button = () => <button onClick={() => count--} />
    `);

  expect(code).toMatchInlineSnapshot(`
    "const count = rjsx.value(() => 1, \\"count\\");

    const Button = () => rjsx.createElement(\\"button\\", {
      onClick: () => count.set(() => count.get() - 1)
    });"
  `);
});

test("Event handler reference with assignment", () => {
  const code = t(`
      const count = 1;
      function handleClick() { count = count + 1; }
      const Button = () => <button onClick={handleClick} />
    `);

  expect(code).toMatchInlineSnapshot(`
    "const count = rjsx.value(() => 1, \\"count\\");

    function handleClick() {
      count.set(() => count.get() + 1);
    }

    const Button = () => rjsx.createElement(\\"button\\", {
      onClick: handleClick
    });"
  `);
});

test("Event handler reference with update", () => {
  const code = t(`
      const count = 1;
      function handleClick() { count++; }
      const Button = () => <button onClick={handleClick} />
    `);

  expect(code).toMatchInlineSnapshot(`
    "const count = rjsx.value(() => 1, \\"count\\");

    function handleClick() {
      count.set(() => count.get() + 1);
    }

    const Button = () => rjsx.createElement(\\"button\\", {
      onClick: handleClick
    });"
  `);
});

test("Transitive event handlers", () => {
  const code = t(`
      const count = 1;
      function handleClick() { inc(); }
      function inc() { count = count + 1; }
      const Button = () => <button onClick={handleClick} />
    `);

  expect(code).toMatchInlineSnapshot(`
    "const count = rjsx.value(() => 1, \\"count\\");

    function handleClick() {
      inc();
    }

    function inc() {
      count.set(() => count.get() + 1);
    }

    const Button = () => rjsx.createElement(\\"button\\", {
      onClick: handleClick
    });"
  `);
});

test("shared variables (react context)", () => {
  const code = t(`
      const count = 1;
      const Inc = () => <button onClick={() => count = count + 1} />
      const Dec = () => <button onClick={() => count = count - 1} />
      const Show = () => <pre>Num is {count}</pre>
    `);

  expect(code).toMatchInlineSnapshot(`
    "const count = rjsx.value(() => 1, \\"count\\");

    const Inc = () => rjsx.createElement(\\"button\\", {
      onClick: () => count.set(() => count.get() + 1)
    });

    const Dec = () => rjsx.createElement(\\"button\\", {
      onClick: () => count.set(() => count.get() - 1)
    });

    const Show = () => rjsx.createElement(\\"pre\\", null, \\"Num is \\", count.get());"
  `);
});

test("side effects (use effect)", () => {
  const code = t(`
      const count = 1;
      document.title = \`The count is \${count}\`;
      const Button = () => <button onClick={() => count = count + 1} />
    `);

  expect(code).toMatchInlineSnapshot(`
    "const count = rjsx.value(() => 1, \\"count\\");
    rjsx.react(() => {
      document.title = \`The count is \${count.get()}\`;
    });

    const Button = () => rjsx.createElement(\\"button\\", {
      onClick: () => count.set(() => count.get() + 1)
    });"
  `);
});
