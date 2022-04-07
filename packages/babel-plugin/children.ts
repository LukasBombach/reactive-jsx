import template from "@babel/template";
import {
  cloneDeepWithoutLoc,
  assertVariableDeclarator,
  assertAssignmentExpression,
  assertIdentifier,
} from "@babel/types";

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

  // getters
  binding.referencePaths
    .filter(ref => ref !== path)
    .forEach(path => {
      assertIdentifier(path.node);
      convertReactiveGetter(name, path);
    });

  // setters
  binding.constantViolations.forEach(path => {
    assertAssignmentExpression(path.node);
    convertReactiveSetter(name, path.node.right, path);
  });

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

const convertReactiveSetter = (name: string, value: Node, parent: NodePath<Node> | null) => {
  const SETTER = `set${name[0].toUpperCase()}${name.substring(1)}`;
  const VALUE = cloneDeepWithoutLoc(value);
  const ast = reactiveSetter({ SETTER, VALUE });
  parent?.replaceWith(ast);
};

const convertReactiveGetter = (name: string, parent: NodePath<Node> | null) => {
  const GETTER = name;
  const ast = reactiveGetter({ GETTER });
  parent?.replaceWith(ast);
};

const reactiveValue = template.statement`
  const [GETTER, SETTER] = ReactiveJsx.value(VALUE);
`;

const reactiveSetter = template.statement`
  SETTER(VALUE)
`;

const reactiveGetter = template.statement`
  GETTER()
`;
