import template from "@babel/template";
import { CallExpression, cloneDeepWithoutLoc, Identifier } from "@babel/types";
import { makeIdentifierReactive } from "./identifiers";

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
              console.log("child", path);

              path.replaceWith(convertToChild(path.node));
            } else {
              console.warn("👧🏻", "cannot handle child of type", path.type);
            }

            /* console.log("👧🏻", path.parentPath?.toString());

            if (path.parentPath && path.parentPath.isCallExpression()) {
              path.parentPath.replaceWith(convertToChild(path.parentPath.node));
            } else if (path.isIdentifier()) {
              console.info("👧🏻", "omitting identifier", path.toString(), path);
            } else {
              console.warn("👧🏻", "cannot handle child of type", path.type);
            } */
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

/* const convertToChildGetter = (identifier: Identifier) => {
  const IDENTIFIER = cloneDeepWithoutLoc(identifier);
  return childGetter({ IDENTIFIER });
};

const childGetter = template.statement`
  ReactiveJsx.child(() => IDENTIFIER());
`;
*/

const convertToChild = (identifier: Identifier) => {
  const IDENTIFIER = cloneDeepWithoutLoc(identifier);
  return child({ IDENTIFIER });
};

const child = template.statement`
  ReactiveJsx.child(() => IDENTIFIER);
`;
