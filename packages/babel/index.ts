import type { NodePath, Node, PluginObj, Visitor } from "@babel/core";
import type { JSXAttribute, ArrowFunctionExpression, FunctionExpression, AssignmentExpression } from "@babel/types";

interface State {
  assignments: NodePath<AssignmentExpression>[];
  debug: any[];
}

function reactiveJsxPlugin(): { name: string; visitor: Visitor<State> } {
  return {
    name: "Reactive JSX",
    visitor: {
      Program: {
        enter(path, state) {
          state.assignments = [];
          state.debug = [];

          path.traverse({ JSXAttribute: path => collectAssignments(path, state) });

          console.debug("assignments", ...state.assignments);
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
        state.assignments.push(assignment);
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
