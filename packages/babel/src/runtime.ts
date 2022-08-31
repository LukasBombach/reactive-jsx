import template from "@babel/template";

export function getRuntimeImports() {
  return buildImports();
}

const buildImports = template.smart(`
  import rjsx from "@reactive-jsx/runtime";
`);
