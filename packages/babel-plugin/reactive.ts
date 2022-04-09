import template from "@babel/template";
import { cloneDeepWithoutLoc, Identifier } from "@babel/types";
import { makeIdentifierReactive } from "./children";

import type { NodePath, PluginObj } from "@babel/core";
import type { JSXAttribute, FunctionDeclaration, FunctionExpression, ArrowFunctionExpression } from "@babel/types";

export const reactive = (): PluginObj => ({
  visitor: {
    JSXAttribute(path) {
      if (isEventHandler(path)) {
        const value = path.get("value");

        if (value.isJSXExpressionContainer()) {
          const expression = value.get("expression");

          if (expression.isIdentifier()) {
            const name = expression.node.name;
            const binding = expression.scope.getBinding(name)!;

            if (binding.path.isFunctionDeclaration()) {
              findReactiveIdentifiersInFunction(binding.path);
            }

            // todo variable = function x () {}
            // todo variable = () => {}
          }

          if (expression.isFunctionExpression() || expression.isArrowFunctionExpression()) {
            findReactiveIdentifiersInFunction(expression);
          }
        }
      }
    },
    JSXElement: {
      enter(path) {
        path
          .get("children")
          .filter(path => path.isJSXExpressionContainer())
          .flatMap(path => path.get("expression"))
          .forEach(path => {
            if (path.isIdentifier()) {
              // makeIdentifierReactive(path);
              path.replaceWith(convertToChild(path.node));
            } else {
              console.warn("cannot handle child");
              // expression(path);
            }
          });
      },
    },
  },
});

function findReactiveIdentifiersInFunction(
  path: NodePath<FunctionDeclaration | FunctionExpression | ArrowFunctionExpression>
) {
  path.get("body").traverse({
    Identifier: path => {
      makeIdentifierReactive(path);
    },
  });
}

function isEventHandler(path: NodePath<JSXAttribute>): boolean {
  const nameIsEventHandler = /^on[A-Z]/;
  const name = path.get("name").node.name;
  return typeof name === "string" ? nameIsEventHandler.test(name) : nameIsEventHandler.test(name.name);
}

const convertToChild = (identifier: Identifier) => {
  const IDENTIFIER = cloneDeepWithoutLoc(identifier);
  return child({ IDENTIFIER });
};

const child = template.statement`
  ReactiveJsx.child(() => IDENTIFIER());
`;
