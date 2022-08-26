import { unique, isNonNullable } from "./typeGuards";
import { isVariableDeclaration, isExpressionStatement, isIdentifier, isAssignmentExpression } from "./typeGuards";

import type { NodePath } from "@babel/core";
import type { Binding } from "@babel/traverse";
import type { Identifier } from "@babel/types";

export function getAssignments(path: Binding): NodePath<Identifier>[] {
  const statements = path.referencePaths.map(path => path.getStatementParent()).filter(isNonNullable);

  const fromVariableDeclaration = statements
    .filter(isVariableDeclaration)
    .flatMap(path => path.get("declarations"))
    .filter(path => !path.get("init").isFunctionExpression())
    .filter(path => !path.get("init").isArrowFunctionExpression())
    .map(path => path.get("id"))
    .filter(isIdentifier);

  const fromExpressionStatement = statements
    .filter(isExpressionStatement)
    .map(path => path.get("expression"))
    .filter(isAssignmentExpression)
    .map(path => path.get("left"))
    .filter(isIdentifier);

  /* console.log(
    statements
      .filter(isExpressionStatement)
      .map(path => path.get("expression"))
      .filter(isAssignmentExpression)
      .map(path => path.get("left"))
      .filter(isIdentifier)
      .map(path => `${path.type} ${path.toString()}`)
  ); */

  return [...fromVariableDeclaration, ...fromExpressionStatement].filter(unique);
}
