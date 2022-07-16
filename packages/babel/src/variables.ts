
import type { NodePath, Node } from "@babel/core";
import type { Binding } from "@babel/traverse";
import type { Identifier } from "@babel/types";

export function getDeclaration(path: NodePath<Identifier>): Binding | undefined {
  const name = path.node.name;
  return path.scope.getBinding(name);
}

export function getGetters(path: Binding): NodePath<Node>[] {
  return path.referencePaths;
}

export function getSetters(path: Binding): NodePath<Node>[] {
  return path.constantViolations;
}
