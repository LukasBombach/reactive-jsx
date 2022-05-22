import template from "@babel/template";
import {
  AssignmentExpression,
  cloneDeepWithoutLoc,
  Expression,
  isIdentifier,
  JSXExpressionContainer,
} from "@babel/types";

import type { NodePath, Node, Visitor } from "@babel/core";
import type {
  JSXAttribute,
  ArrowFunctionExpression,
  FunctionExpression,
  Identifier,
  JSXElement,
  UpdateExpression,
} from "@babel/types";
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

          path.unshiftContainer("body", importRuntime);

          for (const binding of state.bindings) {
            // x
            if (!binding.path.isVariableDeclarator()) return;
            if (!isIdentifier(binding.path.node.id)) return;
            if (!binding.path.node.init) return;

            // replacements
            const GETTER = binding.path.node.id.name;
            const SETTER = `set${GETTER[0].toUpperCase()}${GETTER.substring(1)}`;

            // reactive getters
            binding.referencePaths
              .filter((path): path is NodePath<Identifier> => path.isIdentifier())
              .forEach(path => {
                path.replaceWith(getter({ GETTER }));
              });

            // reactive assignment expressions
            binding.constantViolations
              .filter((path): path is NodePath<AssignmentExpression> => path.isAssignmentExpression())
              .forEach(path => {
                path.replaceWith(setter({ SETTER, VALUE: cloneDeepWithoutLoc(path.node.right) }));
              });

            // reactive update expressions
            binding.constantViolations
              .filter((path): path is NodePath<UpdateExpression> => path.isUpdateExpression())
              .forEach(path => {
                if (path.node.operator === "++") path.replaceWith(add({ SETTER, GETTER, VALUE: "1" }));
                if (path.node.operator === "--") path.replaceWith(sub({ SETTER, GETTER, VALUE: "1" }));
              });

            // reactive statements
            /**
             * todo
             * - collect all statements with path.getStatementParent()
             * - filter statements which are nested in other statements
             * - make the remaining statements reactive
             */
            binding.referencePaths.forEach(path => {
              const reactiveStatement = findReactiveStatement(path);
              // console.log("reactiveStatement", reactiveStatement);
            });

            // declaration
            const VALUE = cloneDeepWithoutLoc(binding.path.node.init);
            binding.path.parentPath.replaceWith(declaration({ GETTER, SETTER, VALUE }));

            // jsx elements (attributes and children)
            path.traverse({
              JSXElement: path => {
                const attributes = path.get("openingElement").get("attributes");
                const children = path.get("children");
                const isComponent = openingElementIsCapitalized(path);

                if (isComponent) return;

                attributes
                  .filter((path): path is NodePath<JSXAttribute> => path.isJSXAttribute())
                  .filter(path => !isEventHandler(path))
                  .map(path => path.get("value"))
                  .filter((path): path is NodePath<JSXExpressionContainer> => path.isJSXExpressionContainer())
                  .map(path => path.get("expression"))
                  .filter((path): path is NodePath<Expression> => path.isExpression())
                  .forEach(path => {
                    const VALUE = cloneDeepWithoutLoc(path.node);
                    path.replaceWith(asFunction({ VALUE }));
                  });

                children
                  .filter((path): path is NodePath<JSXExpressionContainer> => path.isJSXExpressionContainer())
                  .map(path => path.get("expression"))
                  .filter((path): path is NodePath<Expression> => path.isExpression())
                  .forEach(path => {
                    const VALUE = cloneDeepWithoutLoc(path.node);
                    path.replaceWith(asFunction({ VALUE }));
                  });
              },
            });
          }
        },
      },
    },
  };
}

function findReactiveStatement(path: NodePath<Node>) {
  // debugger;
  // console.log(path.parentPath?.toString());

  console.log(path.getStatementParent()?.toString());

  return null;
}

function openingElementIsCapitalized(path: NodePath<JSXElement>): boolean {
  const namePath = path.get("openingElement").get("name");
  if (!namePath.isJSXIdentifier()) return false;
  return /[A-Z]/.test(namePath.node.name.charAt(0));
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
      UpdateExpression: path => {
        const argument = path.get("argument");
        if (!argument.isIdentifier()) return;

        const name = argument.node.name;
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

const declaration = template.statement`
  const [GETTER, SETTER] = rjsx.val(VALUE);
`;

const getter = template.statement`
  GETTER()
`;

const setter = template.statement`
  SETTER(VALUE)
`;

const add = template.statement`
  SETTER(GETTER() + VALUE)
`;

const sub = template.statement`
  SETTER(GETTER() - VALUE)
`;

const asFunction = template.statement`
  () => VALUE
`;

const importRuntime = template.ast(`
  import rjsx from "@reactive-jsx/runtime";
`);

export default reactiveJsxPlugin;
