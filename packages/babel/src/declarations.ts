import { getEventHandlers } from "./eventHandlers";
import { getDeclaration } from "./variables";
import { getAssignments } from "./assignments";
import { getMutatedVariables } from "./mutations";
import { unique, isNonNullable } from "./typeGuards";

import type { NodePath } from "@babel/core";
import type { Program } from "@babel/types";

export function getDeclarations(path: NodePath<Program>) {
  const eventHandlers = getEventHandlers(path);

  const mutatedVariables = eventHandlers
    .flatMap(getMutatedVariables)
    .map(getDeclaration)
    .filter(isNonNullable)
    .filter(unique);

  const assignedVariables = mutatedVariables
    .flatMap(getAssignments)
    .map(getDeclaration)
    .filter(isNonNullable)
    .filter(unique);

  return [...mutatedVariables, ...assignedVariables].filter(unique);
}
