
import type { NodePath, Node } from "@babel/core";
import type { ArrowFunctionExpression, FunctionDeclaration, FunctionExpression, Identifier } from "@babel/types";

type SomeKindOfFunction = ArrowFunctionExpression | FunctionExpression | FunctionDeclaration;

export function getMutatedVariables(path: NodePath<SomeKindOfFunction>): NodePath<Identifier>[] {
  const identifiers: NodePath<Identifier>[] = [];

  path.traverse({
    AssignmentExpression: path => {
      const left = path.get("left");
      if (left.isIdentifier()) identifiers.push(left);
    },
    UpdateExpression: path => {
      const argument = path.get("argument");
      if (argument.isIdentifier()) identifiers.push(argument);
    },
    CallExpression: path => {
      const callee = path.get("callee");
      const fn = getFunction(callee);
      if (fn) identifiers.push(...getMutatedVariables(fn));
    },
  });

  return identifiers;
}

function getFunction(path: NodePath<Node>): NodePath<SomeKindOfFunction> | undefined {
  if (!path.isIdentifier()) return;

  const binding = path.scope.getBinding(path.node.name);

  if (!binding) return;

  if (binding.path.isFunctionDeclaration()) {
    return binding.path;
  }

  if (binding.path.isVariableDeclarator()) {
    const init = binding.path.get("init");
    if (!init) return;
    if (init.isArrowFunctionExpression() || init.isFunctionExpression()) {
      return init;
    }
  }
}
