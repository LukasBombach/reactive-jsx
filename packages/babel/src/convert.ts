import { statement } from "@babel/template";
import { cloneDeepWithoutLoc } from "@babel/types";
import { isVariableDeclaration, isExpressionStatement, isIdentifier, isAssignmentExpression } from "./typeGuards";

import type { NodePath, Node } from "@babel/core";
import type { VariableDeclarator, Statement, Identifier } from "@babel/types";
import type { AssignmentExpression } from "@babel/types";

export function convertDeclaration(path: NodePath<VariableDeclarator>): Statement {
  const id = path.get("id");
  const init = path.get("init");
  if (!id.isIdentifier()) throw new Error("id is not an identifier");
  const VALUE = init.isExpression() ? cloneDeepWithoutLoc(init.node) : "undefined";
  const NAME = id.node.name;
  return buildDeclaration({ VALUE, NAME });
}

export function convertGetter(path: NodePath<Identifier>): Statement {
  const NAME = path.node.name;
  return buildGetter({ NAME });
}

export function convertSetter(path: NodePath<AssignmentExpression>): Statement {
  const left = path.get("left");
  if (!left.isIdentifier()) throw new Error("left is not an identifier");
  const NAME = left.node.name;
  return buildSetter({ NAME, VALUE: cloneDeepWithoutLoc(path.node.right) });
}

export function convertStatement(path: NodePath<Node>): Statement {
  const VALUE = cloneDeepWithoutLoc(path.node);
  return buildReaction({ VALUE });
}

const buildDeclaration = statement`
  const NAME = rjsx.value(() => VALUE, "NAME");
`;

const buildGetter = statement`
  NAME.get()
`;

const buildSetter = statement`
  NAME.set(() => VALUE)
`;

const buildReaction = statement`
  rjsx.react(() => { VALUE });
`;
