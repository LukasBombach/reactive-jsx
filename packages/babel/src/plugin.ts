import template from "@babel/template";
import { cloneDeepWithoutLoc } from "@babel/types";
import { getDeclarations } from "./declarations";
import { getStatements } from "./statements";
import { getGetters, getSetters } from "./variables";
import { convertDeclaration, convertGetter, convertSetter, convertUpdateExpression, convertStatement } from "./convert";
import { getRuntimeImports } from "./runtime";
import { isVariableDeclarator, isIdentifier, isAssignmentExpression, isUpdateExpression } from "./typeGuards";
import { isExpression, isJSXExpressionContainer } from "./typeGuards";

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

          setters.filter(isAssignmentExpression).forEach(path => {
            const reactiveSetter = convertSetter(path);
            path.replaceWith(reactiveSetter);
          });

          setters.filter(isUpdateExpression).forEach(path => {
            const reactiveSetter = convertUpdateExpression(path);
            path.replaceWith(reactiveSetter);
          });

          statements.forEach(path => {
            const reactiveStatement = convertStatement(path);
            path.replaceWith(reactiveStatement);
          });

          path.traverse({
            JSXElement: path => {
              // const attributes = path.get("openingElement").get("attributes");
              const children = path.get("children");
              // const isComponent = openingElementIsCapitalized(path);

              // if (isComponent) return;

              /* attributes
                .filter((path): path is NodePath<JSXAttribute> => path.isJSXAttribute())
                .filter(path => !isEventHandler(path))
                .map(path => path.get("value"))
                .filter((path): path is NodePath<JSXExpressionContainer> => path.isJSXExpressionContainer())
                .map(path => path.get("expression"))
                .filter((path): path is NodePath<Expression> => path.isExpression())
                .forEach(path => {
                  const VALUE = cloneDeepWithoutLoc(path.node);
                  path.replaceWith(asFunction({ VALUE }));
                }); */

              children
                .filter(isJSXExpressionContainer)
                .map(path => path.get("expression"))
                .filter(isExpression)
                .forEach(path => {
                  const VALUE = cloneDeepWithoutLoc(path.node);
                  path.replaceWith(asFunction({ VALUE }));
                });
            },
          });

          path.unshiftContainer("body", getRuntimeImports());
        },
      },
    },
  };
}

const asFunction = template.statement`
  () => VALUE
`;
