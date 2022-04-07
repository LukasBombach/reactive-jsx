import template from "@babel/template";
import {
  isIdentifier,
  isConditionalExpression,
  isAssignmentExpression,
  isJSXExpressionContainer,
  isJSXIdentifier,
  cloneDeepWithoutLoc,
} from "@babel/types";

import type { NodePath, Node, PluginObj } from "@babel/core";
import type { Statement, Identifier } from "@babel/types";

const value = template`
  const [GETTER, SETTER] = ReactiveJsx.value(VALUE);
`;

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
  const binding = path.scope.getBinding(name);

  if (!binding) {
    return;
  }

  if (binding.kind === "const") {
    return;
  }
  if (binding.constantViolations.length === 0) {
    return;
  }

  // value
  convertReactiveValue(binding.path);

  // setters

  // getters

  // blocks

  console.log(binding);
};

const convertReactiveValue = (path: NodePath<Node>) => {};
