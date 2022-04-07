import template from "@babel/template";
import { cloneDeepWithoutLoc, assertVariableDeclarator, assertAssignmentExpression } from "@babel/types";

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
  const getter = name;
  const setter = `set${name[0].toUpperCase()}${name.substring(1)}`;

  // No need to make values reactive that never get updated
  if (binding.constantViolations.length === 0) {
    return;
  }

  // value
  parent.replaceWith(convertReactiveValue(getter, setter, value));

  // getters
  binding.referencePaths
    .filter(ref => ref !== path)
    .filter(path => path.isIdentifier())
    .forEach(path => {
      path.replaceWith(convertReactiveGetter(getter));
    });

  // setters
  binding.constantViolations.forEach(path => {
    assertAssignmentExpression(path.node);
    path.replaceWith(convertReactiveSetter(setter, path.node.right));
  });

  // blocks

  console.log(binding);
};

const convertReactiveValue = (GETTER: string, SETTER: string, value: Node) => {
  const VALUE = cloneDeepWithoutLoc(value);
  return reactiveValue({ GETTER, SETTER, VALUE });
};

const convertReactiveSetter = (SETTER: string, value: Node) => {
  const VALUE = cloneDeepWithoutLoc(value);
  return reactiveSetter({ SETTER, VALUE });
};

const convertReactiveGetter = (GETTER: string) => {
  return reactiveGetter({ GETTER });
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
