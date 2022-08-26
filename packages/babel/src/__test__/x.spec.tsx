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

test("x", () => {
  const code = t(`
      const count = 1;
      const Button = () => <button onClick={() => count = count + 1} />
    `);

  expect(code).toMatchInlineSnapshot(`
    "const count = rjsx.value(() => 1, \\"count\\");

    const Button = () => rjsx.createElement(\\"button\\", {
      onClick: () => count.set(() => count + 1)
    });"
  `);
});
