import template from "@babel/template";
import { cloneDeepWithoutLoc, assertVariableDeclarator } from "@babel/types";

import type { NodePath, Node, PluginObj } from "@babel/core";
import type { Identifier } from "@babel/types";

export const children = (): PluginObj => ({
  visitor: {
    JSXElement: {
      enter(path) {
        path
          .get("children")
          .filter(path => path.isJSXExpressionContainer())
          .flatMap(path => path.get("expression"))
          .forEach(path => {
            if (path.isIdentifier()) {
              identifier(path);
            } else {
              console.warn("cannot handle child", path);
            }
          });
      },
    },
  },
});

const identifier = (path: NodePath<Identifier>): void => {
  const name = path.node.name;
  const binding = path.scope.getBinding(name)!;

  assertVariableDeclarator(binding.path.node);

  const value = binding.path.node.init!;
  const parent = binding.path.parentPath!;

  if (binding.constantViolations.length === 0) {
    return;
  }

  // value
  convertReactiveValue(name, value, parent);

  // setters

  // getters

  // blocks

  console.log(binding);
};

const convertReactiveValue = (name: string, value: Node, parent: NodePath<Node> | null) => {
  const GETTER = name;
  const SETTER = `set${name[0].toUpperCase()}${name.substring(1)}`;
  const VALUE = cloneDeepWithoutLoc(value);
  const ast = reactiveValue({ GETTER, SETTER, VALUE });
  parent?.replaceWith(ast);
};

const reactiveValue = template.statement`
  const [GETTER, SETTER] = ReactiveJsx.value(VALUE);
`;
