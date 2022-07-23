import { transformAsync } from "@babel/core";

import type { NodePath, Visitor } from "@babel/core";
import type { Program } from "@babel/types";

// todo probably the wrong way to create a NodePath<Program>
export async function getProgram(code: string): Promise<NodePath<Program>> {
  let path: NodePath<Program> | undefined = undefined;

  await transformAsync(code, {
    filename: "test.tsx",
    presets: ["@babel/preset-env", "@babel/preset-react"],
    plugins: [
      (): { visitor: Visitor } => ({
        visitor: {
          Program: p => {
            path = p;
          },
        },
      }),
    ],
  });

  if (path === undefined) {
    throw new Error("path is undefined");
  }

  return path;
}
