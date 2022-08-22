import { transformAsync } from "@babel/core";
import { build } from "esbuild";

const pluginSrc = "src/plugin.ts";
const pluginDist = "dist/plugin.js";

async function buildPlugin() {
  await build({
    entryPoints: [pluginSrc],
    outfile: pluginDist,
    bundle: true,
    format: "cjs",
  });
}

async function transform(source: string) {
  return await transformAsync(source, {
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
}

test("x", async () => {
  await buildPlugin();

  const { code } =
    (await transform(`
    const count = 1;
    const Button = () => <Button onClick={() => count = count + 1} />
  `)) ?? {};

  expect(code).toBe(`
    const [getCount, setCount] = rjsx.value(1);
    const Button = () => <Button onClick={() => setCount(getCount() + 1)} />
  `);
});
