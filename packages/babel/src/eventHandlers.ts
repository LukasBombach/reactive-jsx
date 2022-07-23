import type { NodePath, Node } from "@babel/core";
import type { ArrowFunctionExpression, FunctionExpression, FunctionDeclaration } from "@babel/types";

export type SomeKindOfFunction = ArrowFunctionExpression | FunctionExpression | FunctionDeclaration;

export function getEventHandlers(path: NodePath<Node>): NodePath<SomeKindOfFunction>[] {
  const functions: NodePath<SomeKindOfFunction>[] = [];

  path.traverse({
    JSXAttribute: path => {
      const identifier = path.get("name").node.name;
      const name = typeof identifier === "string" ? identifier : identifier.name;

      if (!/^on[A-Z]/.test(name)) return;

      const value = path.get("value");

      if (!value.isJSXExpressionContainer()) return;
      const expression = value.get("expression");

      if (expression.isArrowFunctionExpression()) {
        functions.push(expression);
      }

      if (expression.isFunctionExpression()) {
        functions.push(expression);
      }

      if (expression.isIdentifier()) {
        const binding = path.scope.getBinding(expression.node.name);
        if (!binding) return;

        if (binding.path.isFunctionDeclaration()) {
          functions.push(binding.path);
        }

        if (binding.path.isVariableDeclarator()) {
          const init = binding.path.get("init");
          if (!init) return;
          if (init.isArrowFunctionExpression() || init.isFunctionExpression()) {
            functions.push(init);
          }
        }
      }
    },
  });

  return functions;
}
