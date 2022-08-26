import { transformAsync } from "@babel/core";

const pluginDist = "dist/plugin.js";

async function transform(source: string): Promise<string> {
  const result = await transformAsync(source, {
    filename: "repl.tsx",
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
    plugins: [require(`../../${pluginDist}`)],
  });

  if (result === null) {
    throw new Error("result is null");
  }

  if (typeof result.code !== "string") {
    throw new Error("code is not a string");
  }

  return result.code;
}

describe("x", () => {
  test("x", async () => {
    const code = await transform(`
      const count = 1;
      const Button = () => <button onClick={() => count = count + 1} />
    `);

    expect(code).toMatchInlineSnapshot(`
      "const count = rjsx.value(() => 1, \\"count\\");

      const Button = () => rjsx.createElement(\\"button\\", {
        onClick: () => rjsx.react(() => {
          count.set(() => count + 1);
        })
      });"
    `);
  });
});
