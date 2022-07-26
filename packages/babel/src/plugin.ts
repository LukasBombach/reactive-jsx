import { getDeclarations } from "./declarations";
import { getStatements } from "./statements";
import { getGetters, getSetters } from "./variables";
import { convertDeclaration, convertGetter, convertSetter, convertStatement } from "./convert";
import { isVariableDeclarator, isIdentifier } from "./typeGuards";

import type { Visitor } from "@babel/core";

export default function reactiveJsxPlugin(): { name: string; visitor: Visitor } {
  return {
    name: "Reactive JSX",
    visitor: {
      Program: {
        enter(path) {
          const declarations = getDeclarations(path);
          const getters = declarations.flatMap(getGetters);
          const setters = declarations.flatMap(getSetters);
          const statements = declarations.flatMap(getStatements);

          declarations
            .map(decl => decl.path)
            .filter(isVariableDeclarator)
            .forEach(path => {
              const reactiveDeclaration = convertDeclaration(path);
              path.parentPath?.replaceWith(reactiveDeclaration);
            });

          // todo what if getter is not a filter?
          getters.filter(isIdentifier).forEach(path => {
            const reactiveGetter = convertGetter(path);
            path.replaceWith(reactiveGetter);
          });

          setters.forEach(path => {
            const reactiveSetter = convertSetter(path);
            path.replaceWith(reactiveSetter);
          });

          statements.forEach(path => {
            const reactiveStatement = convertStatement(path);
            path.replaceWith(reactiveStatement);
          });
        },
      },
    },
  };
}
