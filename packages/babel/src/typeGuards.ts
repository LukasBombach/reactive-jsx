import type { NodePath, Node } from "@babel/core";
import type { AssignmentExpression, UpdateExpression, ExpressionStatement } from "@babel/types";
import type { VariableDeclaration, VariableDeclarator, Identifier } from "@babel/types";
import type { Expression, JSXExpressionContainer } from "@babel/types";

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

export function isExpression(path: NodePath<Node>): path is NodePath<Expression> {
  return path.isExpression();
}

export function isAssignmentExpression(path: NodePath<Node>): path is NodePath<AssignmentExpression> {
  return path.isAssignmentExpression();
}

export function isUpdateExpression(path: NodePath<Node>): path is NodePath<UpdateExpression> {
  return path.isUpdateExpression();
}

export function isVariableDeclarator(path: NodePath<Node>): path is NodePath<VariableDeclarator> {
  return path.isVariableDeclarator();
}

export function isJSXExpressionContainer(path: NodePath<Node>): path is NodePath<JSXExpressionContainer> {
  return path.isJSXExpressionContainer();
}
