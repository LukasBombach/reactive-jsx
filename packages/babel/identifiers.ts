import template from "@babel/template";
import { cloneDeepWithoutLoc } from "@babel/types";

import type { NodePath, Node, PluginObj } from "@babel/core";
import type { Identifier } from "@babel/types";

export const makeIdentifierReactive = (path: NodePath<Identifier>): void => {
  const name = path.node.name;
  const binding = path.scope.getBinding(name);

  if (!binding) {
    return;
  }

  if (!binding.path.isVariableDeclarator()) {
    return;
  }

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

  // binding.referencePaths.forEach(path => {
  //   console.log(path.toString(), "|", path.parentPath?.toString());
  //   console.log(path);
  // });

  // Replaces accesors of `name` with `name()`
  console.log("ref paths", binding.referencePaths);
  binding.referencePaths
    /* .map(path => {
      console.log(path.parentPath?.toString());
      return path;
    }) */
    .filter(path => path.isIdentifier())
    // we want to forward the reactive function objects to the runtime.element fn for it to execute
    // .filter(path => !path.findParent(parent => parent.isJSXElement()))
    // these have already been transformed to function calls
    // .filter(path => !path.parentPath?.isCallExpression())
    .forEach(path => {
      path.replaceWith(reactiveGetter({ GETTER: getter }));
    });

  // Replaces assignemtns `name = xxx` with `setName(xxx)`
  binding.constantViolations.forEach(path => {
    if (path.isAssignmentExpression()) {
      // console.log(path.node.right);
      // console.log(path);
      path.replaceWith(convertToReactiveSetter(setter, path.node.right));
    }
  });

  // reactive blocks (if statements etc)
  binding.referencePaths
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

function isDefined<T>(val: T): val is NonNullable<T> {
  return val !== undefined && val !== null;
}
