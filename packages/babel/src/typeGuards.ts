import type { NodePath, Node } from "@babel/core";
import type { AssignmentExpression, ExpressionStatement, Identifier } from "@babel/types";
import type { VariableDeclaration, VariableDeclarator } from "@babel/types";

export function unique<T>(value: T, index: number, array: T[]): boolean {
  return array.indexOf(value) === index;
}

export function isNonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

export function isVariableDeclaration(path: NodePath<Node>): path is NodePath<VariableDeclaration> {
  return path.isVariableDeclaration();
}

export function isExpressionStatement(path: NodePath<Node>): path is NodePath<ExpressionStatement> {
  return path.isExpressionStatement();
}

export function isIdentifier(path: NodePath<Node>): path is NodePath<Identifier> {
  return path.isIdentifier();
}

export function isAssignmentExpression(path: NodePath<Node>): path is NodePath<AssignmentExpression> {
  return path.isAssignmentExpression();
}

export function isVariableDeclarator(path: NodePath<Node>): path is NodePath<VariableDeclarator> {
  return path.isVariableDeclarator();
}
