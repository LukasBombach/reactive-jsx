import { transformAsync } from "@babel/core";

import type { Visitor } from "@babel/core";

// todo this seems like a very wrong way to do things
export async function visit(code: string, visitor: Visitor) {
  await transformAsync(code, {
    filename: "test.tsx",
    presets: ["@babel/preset-env", "@babel/preset-react"],
    plugins: [() => ({ visitor })],
  });
}
