import { isNonNullable } from "./typeGuards";

import type { NodePath } from "@babel/core";
import type { Binding } from "@babel/traverse";
import type { Statement } from "@babel/types";

export function getStatements(path: Binding): NodePath<Statement>[] {
  const statements: NodePath<Statement>[] = [];

  path.referencePaths
    .filter(ref => !ref.findParent(parent => parent.isJSXElement()))
    .map(ref => ref.getStatementParent())
    .filter(isNonNullable)
    // .filter(ref => !path.constantViolations.map(v => v.parentPath).includes(ref))
    .filter(ref => !ref.isReturnStatement()) // todo make return statements work
    .filter(ref => !ref.isVariableDeclaration())
    .filter(ref => !statements.includes(ref))
    .filter(ref => !statements.some(parent => ref.isDescendant(parent)))
    .forEach(ref => statements.push(ref));

  return statements;
}
