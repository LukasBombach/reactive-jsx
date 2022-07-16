import { getEventHandlers } from "./eventHandlers";
import { getStatements } from "./statements";
import { getAssignments } from "./assignments";
import { getMutatedVariables } from "./mutations";
import { getDeclaration, getGetters, getSetters } from "./variables";
import { unique, isNonNullable } from "./typeGuards";

import type { Visitor } from "@babel/core";

export default function reactiveJsxPlugin(): { name: string; visitor: Visitor } {
  return {
    name: "Reactive JSX",
    visitor: {
      Program: {
        enter(path) {
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

          const declarations = [...mutatedVariables, ...assignedVariables].filter(unique);
          const getters = declarations.flatMap(getGetters);
          const setters = declarations.flatMap(getSetters);
          const statements = declarations.flatMap(getStatements);
        },
      },
    },
  };
}
