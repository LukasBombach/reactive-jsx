import type { NodePath, Node, Visitor } from "@babel/core";
import type { JSXElement, JSXAttribute, ArrowFunctionExpression, FunctionExpression, Identifier } from "@babel/types";
import type { Binding } from "@babel/traverse";

interface State {
  reactiveBindings: Binding[];
  identifiers: NodePath<Identifier>[];
}

function reactiveJsxPlugin(): { name: string; visitor: Visitor<State> } {
  return {
    name: "Reactive JSX",
    visitor: {
      Program: {
        enter(path, state) {
          state.reactiveBindings = [];
          state.identifiers = [];

          path.traverse({
            JSXElement: path => {
              collectIdentifiers(path, state);
            },
            JSXAttribute: path => {
              collectReactiveBindings(path, state);
            },
          });

          console.debug("reactiveBindings", state.reactiveBindings);
          console.debug(
            "identifiers",
            state.identifiers.map(path => path.parentPath?.toString())
          );
        },
      },
    },
  };
}

function collectReactiveBindings(path: NodePath<JSXAttribute>, state: State) {
  if (!isEventHandler(path)) return;

  // todo this can be simplified by traversing the path directly (I guess?)
  const expression = path.get("value").get("expression");
  assertNotAnArray(expression);

  if (isAnyTypeOfFunctionExpression(expression)) {
    expression.traverse({
      AssignmentExpression: path => {
        const left = path.get("left");
        if (!left.isIdentifier()) return;

        const name = left.node.name;
        const binding = path.scope.getBinding(name);

        if (!binding) return;
        if (!binding.path.isVariableDeclarator()) return;
        if (binding.kind === "const") return;
        if (binding.constantViolations.length === 0) return;

        state.reactiveBindings.push(binding);
      },
    });
  }
}

function collectIdentifiers(path: NodePath<JSXElement>, state: State) {
  path.traverse({
    Identifier: path => {
      const isAssignment = path.parentPath?.isAssignmentExpression() && path.parentPath?.get("left") === path;
      if (isAssignment) return;
      state.identifiers.push(path);
    },
  });
}

function isEventHandler(path: NodePath<JSXAttribute>): boolean {
  const identifier = path.get("name").node.name;
  const name = typeof identifier === "string" ? identifier : identifier.name;
  return /^on[A-Z]/.test(name);
}

function isAnyTypeOfFunctionExpression(
  path: NodePath<Node>
): path is NodePath<ArrowFunctionExpression | FunctionExpression> {
  return path.isFunctionExpression() || path.isArrowFunctionExpression();
}

function assertNotAnArray<T>(value: T | T[]): asserts value is T {
  if (Array.isArray(value)) {
    throw new Error("Expected value not to be an array");
  }
}

export default reactiveJsxPlugin;
