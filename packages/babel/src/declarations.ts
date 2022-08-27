import { getEventHandlers } from "./eventHandlers";
import { getDeclaration } from "./variables";
import { getAssignments } from "./assignments";
import { getMutatedVariables } from "./mutations";
import { unique, isNonNullable } from "./typeGuards";

import type { NodePath } from "@babel/core";
import type { Program } from "@babel/types";
import type { Binding } from "@babel/traverse";

export function getDeclarations(path: NodePath<Program>) {
  const eventHandlers = getEventHandlers(path);

  const mutatedVariables = eventHandlers
    .flatMap(getMutatedVariables)
    .map(getDeclaration)
    .filter(isNonNullable)
    .filter(unique);

  const assignedVariables = findAssignedVariables(mutatedVariables);

  return [...mutatedVariables, ...assignedVariables].filter(unique);
}

function findAssignedVariables(bindings: Binding[]): Binding[] {
  const assignments = bindings
    .flatMap(getAssignments)
    .map(getDeclaration)
    .filter(isNonNullable)
    .filter(unique)
    .filter(assignment => !bindings.includes(assignment));

  if (assignments.length) {
    return [...assignments, ...findAssignedVariables(assignments)].filter(unique);
  }

  return assignments;
}
