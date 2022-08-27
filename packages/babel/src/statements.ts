import { isNonNullable, unique } from "./typeGuards";

import type { NodePath } from "@babel/core";
import type { Binding } from "@babel/traverse";
import type { Node } from "@babel/types";

export function getStatements(path: Binding): NodePath<Node>[] {
  const statements: NodePath<Node>[] = [];

  path.referencePaths
    .map(path => findReactiveBlock(path))
    .filter(isNonNullable)
    .forEach(path => statements.push(path));

  return statements.filter(unique);
}

function findReactiveBlock(path: NodePath<Node>): NodePath<Node> | undefined {
  const blockTypes = ["ForStatement", "WhileStatement", "IfStatement", "AssignmentExpression"];

  const ancestry = path.getAncestry();

  // console.log(ancestry.map(path => `${path.type} | ${path.toString()}`));

  if (ancestry.some(isJsxEventHandler)) {
    return undefined;
  }

  // reverse.find = find from the outside in (findLast)
  return ancestry.reverse().find(p => blockTypes.includes(p.type));
}

const isJsxEventHandler = (path: NodePath<Node>): boolean => {
  if (path.isFunctionDeclaration() && path.node.id) {
    const name = path.node.id.name;
    const binding = path.scope.getBinding(name);
    if (!binding) return false;
    return binding.referencePaths.flatMap(path => path.getAncestry()).some(isJsxEventHandler);
  }

  if (!path.isJSXAttribute()) return false;

  const identifier = path.get("name").node.name;
  const name = typeof identifier === "string" ? identifier : identifier.name;

  return /^on[A-Z]/.test(name);
};
