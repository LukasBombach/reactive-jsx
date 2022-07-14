import template from "@babel/template";
import {
  AssignmentExpression,
  cloneDeepWithoutLoc,
  Expression,
  isIdentifier,
  JSXExpressionContainer,
} from "@babel/types";

import type { NodePath, Node, Visitor, PluginPass } from "@babel/core";
import type { Binding } from "@babel/traverse";
import type {
  ArrowFunctionExpression,
  FunctionExpression,
  Identifier,
  JSXAttribute,
  JSXElement,
  Statement,
  UpdateExpression,
  VariableDeclarator,
  Program,
  VariableDeclaration,
  FunctionDeclaration,
} from "@babel/types";

let runs = 0;

function reactiveJsxPlugin(): { name: string; visitor: Visitor } {
  return {
    name: "Reactive JSX",
    visitor: {
      Program: {
        enter(path) {
          // console.log("this is run #", ++runs);

          // todo getBindingIdentifier || getOwnBindingIdentifier

          const directBindings = getMutatedIdentifiersInEventHandlers(path)
            .map(getBinding)
            .filter(unique)
            .filter(defined);

          const indirectBindings = getAssignmentsUsingReferences(directBindings)
            .map(getBinding)
            .filter(unique)
            .filter(defined);

          const bindings = [...directBindings, ...indirectBindings];

          // Convert usages to getters (`count` becomes `count()`)
          bindings.forEach(binding => {
            if (!binding.path.isVariableDeclarator()) return;
            if (!isIdentifier(binding.path.node.id)) return;

            const NAME = binding.path.node.id.name;

            binding.referencePaths.filter(identifier).forEach(path => {
              path.replaceWith(getter({ NAME }));
            });
          });

          // Convert mutations to setters (`count = X` becomes `setCount()`)
          bindings.forEach(binding => {
            if (!binding.path.isVariableDeclarator()) return;
            if (!isIdentifier(binding.path.node.id)) return;

            const NAME = binding.path.node.id.name;

            // AssignmentExpressions (`count = X` becomes `setCount(X)`)
            binding.constantViolations.filter(assignmentExpression).forEach(path => {
              // todo the worst code possible here
              // todo validate begins with onX
              const isInEventHandler = !!path.findParent(p => p.isJSXAttribute());

              if (isInEventHandler) {
                path.replaceWith(nonReactiveSetter({ NAME, VALUE: cloneDeepWithoutLoc(path.node.right) }));
              } else {
                path.replaceWith(setter({ NAME, VALUE: cloneDeepWithoutLoc(path.node.right) }));
              }
            });

            // UpdateExpressions (`count++` becomes `setCount(count() + 1)`)
            binding.constantViolations.filter(updateExpression).forEach(path => {
              // todo the worst code possible here
              // todo validate begins with onX
              const isInEventHandler = !!path.findParent(p => p.isJSXAttribute());

              const VALUE =
                path.node.operator === "++"
                  ? add({ NAME, VALUE: "1" })
                  : path.node.operator === "--"
                  ? sub({ NAME, VALUE: "1" })
                  : null;

              if (VALUE === null) {
                throw new Error(`Unexpected operator ${path.node.operator}`);
              }

              if (isInEventHandler) {
                path.replaceWith(nonReactiveSetter({ NAME, VALUE }));
              } else {
                path.replaceWith(setter({ NAME, VALUE }));
              }
            });
          });

          const statements: NodePath<Statement>[] = [];

          bindings
            .flatMap(binding => binding.referencePaths)
            .filter(path => !(path.parentPath && cheapTempIsReactiveSetter(path.parentPath)))
            .filter(path => !path.findParent(parent => parent.isJSXElement()))
            .map(path => path.getStatementParent())
            .filter((path): path is NodePath<Statement> => path !== null)
            .filter(path => !path.isReturnStatement())
            .filter(path => !statements.includes(path))
            .filter(path => !statements.some(parent => path.isDescendant(parent)))
            .forEach(path => statements.push(path));

          function cheapTempIsReactiveSetter(path: NodePath<Node>): boolean {
            return (
              path.isCallExpression() &&
              path.get("callee").isMemberExpression() &&
              (path.get("callee").get("property") as NodePath<Identifier>)?.node?.name === "set"
            );
          }

          statements.forEach(path => {
            const VALUE = cloneDeepWithoutLoc(path.node);
            path.replaceWith(reaction({ VALUE }));
          });

          // Convert declarations (`let count = X` becomes `const [count, setCount] = rjsx.val(X)`)

          bindings.forEach(binding => {
            if (!binding.path.isVariableDeclarator()) return;
            if (!isIdentifier(binding.path.node.id)) return;

            const NAME = binding.path.node.id.name;
            const VALUE = binding.path.node.init ? cloneDeepWithoutLoc(binding.path.node.init) : "undefined";

            binding.path.parentPath.replaceWith(declaration({ NAME, VALUE }));
          });

          // JSX Elements
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

          // Inject runtime
          path.unshiftContainer("body", runtimeImports());
        },
      },
    },
  };
}

function openingElementIsCapitalized(path: NodePath<JSXElement>): boolean {
  const namePath = path.get("openingElement").get("name");
  if (!namePath.isJSXIdentifier()) return false;
  return /[A-Z]/.test(namePath.node.name.charAt(0));
}

const asFunction = template.statement`
  () => VALUE
`;

const runtimeImports = template.smart(`
  import rjsx from "@reactive-jsx/runtime";
`);

const declaration = template.statement`
  const NAME = rjsx.value(() => VALUE, "NAME");
`;

const getter = template.statement`
  NAME.get()
`;

const setter = template.statement`
  NAME.set(() => VALUE)
`;

const nonReactiveSetter = template.statement`
  NAME.set(VALUE)
`;

const add = template.expression`
  NAME.get() + VALUE
`;

const sub = template.expression`
  NAME.get() - VALUE
`;

const reaction = template.statement`
  rjsx.react(() => { VALUE });
`;

function followFunctionForMutations(
  path: NodePath<FunctionDeclaration | ArrowFunctionExpression | FunctionExpression>,
  identifiers: NodePath<Node>[]
) {
  path.traverse({
    AssignmentExpression: path => {
      identifiers.push(path.get("left"));
    },
    UpdateExpression: path => {
      identifiers.push(path.get("argument"));
    },
    CallExpression: path => {
      const callee = path.get("callee");
      // todo
      console.log(callee);
    },
  });
}

function getMutatedIdentifiersInEventHandlers(path: NodePath<Program>): NodePath<Identifier>[] {
  const paths: NodePath<Node>[] = [];

  path.traverse({
    JSXAttribute: path => {
      if (isEventHandler(path)) {
        path.traverse({
          AssignmentExpression: path => {
            paths.push(path.get("left"));
          },
          UpdateExpression: path => {
            paths.push(path.get("argument"));
          },
          Identifier: path => {
            const binding = path.scope.getBinding(path.node.name);
            if (!binding) return;
            if (binding.path.isFunctionDeclaration()) {
              followFunctionForMutations(binding.path, paths);
            }
            if (binding.path.isVariableDeclarator()) {
              const init = binding.path.get("init");
              if (!init) return;
              if (init.isArrowFunctionExpression() || init.isFunctionExpression()) {
                followFunctionForMutations(init, paths);
              }
            }
          },
        });
      }
    },
  });

  return paths.filter(identifier);
}

function getAssignmentsUsingReferences(bindings: Binding[]): NodePath<Identifier>[] {
  return bindings
    .flatMap(binding => binding.referencePaths)
    .map(path => path.getStatementParent())
    .filter(defined)
    .flatMap(path => [...getIdentifiersFromVariableDeclaration(path), ...getIdentifiersFromExpressionStatement(path)]);
}

function isComponent(path: NodePath<VariableDeclarator>): boolean {
  const init = path.get("init");
  return init.isArrowFunctionExpression() && init.get("body").isJSXElement();
}

function getIdentifiersFromVariableDeclaration(path: NodePath<Node>): NodePath<Identifier>[] {
  if (path.isVariableDeclaration()) {
    return path
      .get("declarations")
      .filter(p => !isComponent(p))
      .map(path => path.get("id"))
      .filter(identifier);
  }
  return [];
}

function getIdentifiersFromExpressionStatement(path: NodePath<Node>): NodePath<Identifier>[] {
  if (path.isExpressionStatement()) {
    return [path.get("expression")]
      .filter(assignmentExpression)
      .map(path => path.get("left"))
      .filter(identifier);
  }
  return [];
}

function i(path: NodePath<Program>): NodePath<Identifier>[] {
  const paths: NodePath<Node>[] = [];

  path.traverse({
    JSXAttribute: path => {
      if (isEventHandler(path)) {
        path.traverse({
          AssignmentExpression: path => {
            paths.push(path.get("left"));
          },
          UpdateExpression: path => {
            paths.push(path.get("argument"));
          },
        });
      }
    },
  });

  return paths.filter(identifier);
}

function getBinding(path: NodePath<Identifier>): Binding | undefined {
  if (!path.isIdentifier()) return;
  const name = path.node.name;
  return path.scope.getBinding(name);
}

function defined<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

function unique<T>(value: T, index: number, array: T[]): boolean {
  return array.indexOf(value) === index;
}

function identifier(path: NodePath<Node>): path is NodePath<Identifier> {
  return path.isIdentifier();
}

function assignmentExpression(path: NodePath<Node>): path is NodePath<AssignmentExpression> {
  return path.isAssignmentExpression();
}

function updateExpression(path: NodePath<Node>): path is NodePath<UpdateExpression> {
  return path.isUpdateExpression();
}

function isEventHandler(path: NodePath<JSXAttribute>): boolean {
  const identifier = path.get("name").node.name;
  const name = typeof identifier === "string" ? identifier : identifier.name;
  return /^on[A-Z]/.test(name);
}

export default reactiveJsxPlugin;
