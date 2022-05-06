import template from "@babel/template";
import { AssignmentExpression, cloneDeepWithoutLoc, Expression, isIdentifier } from "@babel/types";

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
              path.replaceWith(getter({ GETTER: path.node.name }));
            });

          state.bindings
            .flatMap(binding => binding.constantViolations)
            .filter((path): path is NodePath<AssignmentExpression> => path.isAssignmentExpression())
            .forEach(path => {
              if (!isIdentifier(path.node.left)) return;
              const name = path.node.left.name;
              const value = cloneDeepWithoutLoc(path.node.right);
              path.replaceWith(createSetter(name, value));
            });

          state.bindings.forEach(binding => {
            const VALUE = cloneDeepWithoutLoc(binding.path.node.init);
            const GETTER = binding.path.node.name;
            const SETTER = `set${GETTER[0].toUpperCase()}${GETTER.substring(1)}`;

            binding.path.parentPath.replaceWith(declaration({ GETTER, SETTER, VALUE }));
          });
        },
      },
    },
  };
}

function collectbindings(path: NodePath<JSXAttribute>, state: State) {
  if (!isEventHandler(path)) return;

  // todo this can be simplified by traversing the path directly (I guess?)
  const expression = path.get("value").get("expression");
  if (Array.isArray(expression)) return;

  if (isFunctionExpression(expression)) {
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

function isFunctionExpression(path: NodePath<Node>): path is NodePath<ArrowFunctionExpression | FunctionExpression> {
  return path.isFunctionExpression() || path.isArrowFunctionExpression();
}

function createSetter(name: string, VALUE: Expression) {
  const SETTER = `set${name[0].toUpperCase()}${name.substring(1)}`;
  return setter({ SETTER, VALUE });
}

const declaration = template.statement`
  const [GETTER, SETTER] = ReactiveJsx.value(VALUE);
`;

const getter = template.statement`
  GETTER()
`;

const setter = template.statement`
  SETTER(VALUE)
`;

export default reactiveJsxPlugin;
