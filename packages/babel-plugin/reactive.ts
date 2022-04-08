import type { NodePath } from "@babel/core";
import { Identifier, JSXAttribute, Node } from "@babel/types";

const attributes = [/^on/];

export const causesForReactivity = { attributes };

export function makeVariablesReactive(path: NodePath<Node>): void {
  const identifiers = findIdentifiersThatNeedToBeReactive(path);
}

function findIdentifiersThatNeedToBeReactive(path: NodePath<Node>): NodePath<Identifier>[] {
  const attributes = getInteraciveAttributes(path);
  return attributes.flatMap(attr => findIdentifiers(attr));
}

/**
 * This is the BABEL / Plugin entry point
 */
function getInteraciveAttributes(path: NodePath<Node>): NodePath<JSXAttribute>[] {}

function findIdentifiers(path: NodePath<JSXAttribute>): NodePath<Identifier>[] {
  // find identiefiers in function calls, recusively
}
