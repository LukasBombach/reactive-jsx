import template from "@babel/template";
import { cloneDeepWithoutLoc, assertVariableDeclarator, assertAssignmentExpression } from "@babel/types";

import type { NodePath, Node, PluginObj } from "@babel/core";
import type { Identifier } from "@babel/types";

export const children = (): PluginObj => ({
  visitor: {
    JSXElement: {
      enter(path) {
        path
          .get("children")
          .filter(path => path.isJSXExpressionContainer())
          .flatMap(path => path.get("expression"))
          .forEach(path => {
            if (path.isIdentifier()) {
              identifier(path);
            } else {
              expression(path);
            }
          });
      },
    },
  },
});

const expression = (path: NodePath<Node>): void => {
  const EXPRESSION = path.node;
  const ast = fn({ EXPRESSION });
  path.replaceWith(ast);
};

const identifier = (path: NodePath<Identifier>): void => {
  const name = path.node.name;
  const binding = path.scope.getBinding(name)!;

  assertVariableDeclarator(binding.path.node);

  const value = binding.path.node.init!;
  const parent = binding.path.parentPath!;
  const getter = name;
  const setter = `set${name[0].toUpperCase()}${name.substring(1)}`;

  // No need to make values reactive that can't get updated
  if (binding.kind === "const") {
    return;
  }

  // No need to make values reactive that never get updated
  if (binding.constantViolations.length === 0) {
    return;
  }

  // Creates a reative value `let name = xxx` becomes `const [name, setName] = value(xxx);`
  parent.replaceWith(convertToReactiveValue(getter, setter, value));

  // Replaces accesors of `name` with `name()`
  binding.referencePaths
    .filter(refPath => refPath !== path)
    .filter(path => path.isIdentifier())
    .forEach(path => {
      path.replaceWith(convertToReactiveGetter(getter));
    });

  // Replaces assignemtns `name = xxx` with `setName(xxx)`
  binding.constantViolations.forEach(path => {
    assertAssignmentExpression(path.node);
    path.replaceWith(convertToReactiveSetter(setter, path.node.right));
  });

  // Finds statements that should need to be re-evaluated reactively
  // and wraps them in reaction(() => { statement })

  binding.referencePaths
    .filter(refPath => refPath !== path)
    .forEach(path => console.log(path.parentPath?.parentPath?.toString()));

  binding.referencePaths
    .filter(refPath => refPath !== path)
    .map(path => path.parentPath?.parentPath)
    .filter(isDefined)
    .filter(shouldBeReactiveStatement)
    .forEach(path => {
      path.replaceWith(convertToReaction(path.node));
    });
};

const convertToReactiveValue = (GETTER: string, SETTER: string, value: Node) => {
  const VALUE = cloneDeepWithoutLoc(value);
  return reactiveValue({ GETTER, SETTER, VALUE });
};

const convertToReactiveSetter = (SETTER: string, value: Node) => {
  const VALUE = cloneDeepWithoutLoc(value);
  return reactiveSetter({ SETTER, VALUE });
};

const convertToReactiveGetter = (GETTER: string) => {
  return reactiveGetter({ GETTER });
};

const convertToReaction = (statement: Node) => {
  const STATEMENT = cloneDeepWithoutLoc(statement);
  return reaction({ STATEMENT });
};

const reactiveValue = template.statement`
  const [GETTER, SETTER] = ReactiveJsx.value(VALUE);
`;

const reactiveSetter = template.statement`
  SETTER(VALUE)
`;

const reactiveGetter = template.statement`
  GETTER()
`;

const reaction = template.statement`
  ReactiveJsx.reaction(() => {
    STATEMENT
  });
`;

const fn = template.statement`
  () => EXPRESSION
`;

function shouldBeReactiveStatement({ type }: NodePath<Node>): boolean {
  return ["IfStatement"].includes(type);
}

// function findReactiveStatement(path: NodePath<Node>): NodePath<Node> | null {
//   return path.findParent(parent => parent.isIfStatement() && path.isDescendant(parent.node.test.path));
// }

function isDefined<T>(val: T): val is NonNullable<T> {
  return val !== undefined && val !== null;
}
