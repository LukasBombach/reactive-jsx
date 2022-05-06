import template from "@babel/template";
import { AssignmentExpression, cloneDeepWithoutLoc } from "@babel/types";

import type { NodePath, Node, Visitor } from "@babel/core";
import type { JSXAttribute, ArrowFunctionExpression, FunctionExpression, Identifier } from "@babel/types";
import type { Binding } from "@babel/traverse";

interface State {
  bindings: Binding[];
}

function reactiveJsxPlugin(): { name: string; visitor: Visitor<State> } {
  return {
    name: "Reactive JSX",
    visitor: {
      Program: {
        enter(path, state) {
          state.bindings = [];

          path.traverse({
            JSXAttribute: path => {
              collectbindings(path, state);
            },
          });

          console.debug("bindings", state.bindings);

          state.bindings
            .flatMap(binding => binding.referencePaths)
            .filter((path): path is NodePath<Identifier> => path.isIdentifier())
            .forEach(path => {
              path.replaceWith(getter({ NAME: path.node.name }));
            });

          state.bindings
            .flatMap(binding => binding.constantViolations)
            .filter((path): path is NodePath<AssignmentExpression> => path.isAssignmentExpression())
            .forEach(path => {
              console.log(path);
              // const NAME = path.node.left;
              // const VALUE = cloneDeepWithoutLoc(path.node.right);
              // path.replaceWith(setter({ NAME: path.node.name }));
            });
        },
      },
    },
  };
}

const getter = template.statement`
  NAME()
`;

const setter = template.statement`
  NAME(VALUE)
`;

function collectbindings(path: NodePath<JSXAttribute>, state: State) {
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

        state.bindings.push(binding);
      },
    });
  }
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
