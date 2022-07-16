import { isNonNullable } from "./typeGuards";

import type { NodePath } from "@babel/core";
import type { Binding } from "@babel/traverse";
import type { Statement } from "@babel/types";

export function getStatements(path: Binding): NodePath<Statement>[] {
  const statements: NodePath<Statement>[] = [];

  path.referencePaths
    .map(path => path.getStatementParent())
    .filter(isNonNullable)
    .filter(path => !path.isReturnStatement()) // todo make return statements work
    .filter(path => !statements.includes(path))
    .filter(path => !statements.some(parent => path.isDescendant(parent)))
    .forEach(path => statements.push(path));

  return statements;
}
