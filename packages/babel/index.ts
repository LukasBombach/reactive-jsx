import type { NodePath, Node, Visitor } from "@babel/core";
import type { JSXAttribute, ArrowFunctionExpression, FunctionExpression } from "@babel/types";
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

          path.traverse({ JSXAttribute: path => collectAssignments(path, state) });

          console.debug("bindings", ...state.bindings);
        },
      },
    },
  };
}

function collectAssignments(path: NodePath<JSXAttribute>, state: State) {
  if (!isEventHandler(path)) return;

  const expression = path.get("value").get("expression");

  if (Array.isArray(expression)) {
    console.warn("unexpectedly received an array as expression, stopping", expression);
    return;
  }

  if (isAnyTypeOfFunctionExpression(expression)) {
    expression.traverse({
      AssignmentExpression: assignment => {
        const left = assignment.get("left");
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
    return;
  }

  console.debug("unknown expression", expression.toString());
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

export default reactiveJsxPlugin;
