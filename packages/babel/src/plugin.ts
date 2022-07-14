import { getEventHandlers } from "./eventHandlers";

import type { NodePath, Node, Visitor } from "@babel/core";
import type { Identifier, ArrowFunctionExpression, FunctionExpression, FunctionDeclaration } from "@babel/types";

export default function reactiveJsxPlugin(): { name: string; visitor: Visitor } {
  return {
    name: "Reactive JSX",
    visitor: {
      Program: {
        enter(path) {
          const eventHandlers = getEventHandlers(path);
          const mutations = getMutatedVariables(eventHandlers);
        },
      },
    },
  };
}

type SomeKindOfFunction = ArrowFunctionExpression | FunctionExpression | FunctionDeclaration;

function getMutatedVariables(functions: NodePath<SomeKindOfFunction>[]): NodePath<Identifier>[] {
  const identifiers: NodePath<Identifier>[] = [];

  functions.forEach(path =>
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
        if (fn) identifiers.push(...getMutatedVariables([fn]));
      },
    })
  );

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
