import { statement } from "@babel/template";
import { cloneDeepWithoutLoc } from "@babel/types";

import type { NodePath, Node } from "@babel/core";
import type { VariableDeclarator, Statement, Identifier } from "@babel/types";
import type { AssignmentExpression, UpdateExpression } from "@babel/types";

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

export function convertUpdateExpression(path: NodePath<UpdateExpression>): Statement {
  const argument = path.get("argument");
  if (!argument.isIdentifier()) throw new Error("argument is not an identifier");
  const NAME = argument.node.name;
  const buildUpdateExpression = path.node.operator === "++" ? buildInc : buildDec;
  return buildUpdateExpression({ NAME });
}

export function convertStatement(path: NodePath<Node>): Statement {
  const VALUE = cloneDeepWithoutLoc(path.node);
  return buildReaction({ VALUE });
}

const buildDeclaration = statement`
  const NAME = rjsx.value(() => VALUE);
`;

const buildGetter = statement`
  NAME.get()
`;

const buildSetter = statement`
  NAME.set(() => VALUE)
`;

const buildInc = statement`
  NAME.set(() => NAME.get() + 1)
`;

const buildDec = statement`
  NAME.set(() => NAME.get() - 1)
`;

const buildReaction = statement`
  rjsx.react(() => { VALUE });
`;
