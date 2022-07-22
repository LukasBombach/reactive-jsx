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

function findReactiveBlock(path: NodePath<Node>) {
  const blockTypes = ["ForStatement", "WhileStatement", "IfStatement", "AssignmentExpression"];
  const ancestry = path.getAncestry();
  // findLast
  return ancestry.reverse().find(p => blockTypes.includes(p.type));
}
