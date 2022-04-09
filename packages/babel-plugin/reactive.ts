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
