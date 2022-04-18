import template from "@babel/template";

import type { PluginObj } from "@babel/core";

const libImport = template.ast(`
  import ReactiveJsx from "@reactive-jsx/runtime";
`);

export const insertImports = (): PluginObj => ({
  visitor: {
    Program(path) {
      path.unshiftContainer("body", libImport);
    },
  },
});
