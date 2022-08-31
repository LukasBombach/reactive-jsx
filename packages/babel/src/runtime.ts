import template from "@babel/template";

export function getRuntimeImports() {
  return buildImports();
}

const buildImports = template.smart(`
  import * as rjsx from "@reactive-jsx/runtime";
`);
