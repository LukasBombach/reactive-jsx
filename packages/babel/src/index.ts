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
} from "@babel/types";

let runs = 0;

function reactiveJsxPlugin(): { name: string; visitor: Visitor } {
  return {
    name: "Reactive JSX",
    visitor: {
      Program: {
        enter(path) {
          console.log("this is run #", ++runs);

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

            const GETTER = binding.path.node.id.name;

            binding.referencePaths.filter(identifier).forEach(path => {
              path.replaceWith(getter({ GETTER }));
            });
          });

          // Convert mutations to setters (`count = X` becomes `setCount()`)
          bindings.forEach(binding => {
            if (!binding.path.isVariableDeclarator()) return;
            if (!isIdentifier(binding.path.node.id)) return;

            const GETTER = binding.path.node.id.name;
            const SETTER = `set${GETTER[0].toUpperCase()}${GETTER.substring(1)}`;

            // AssignmentExpressions (`count = X` becomes `setCount(X)`)
            binding.constantViolations.filter(assignmentExpression).forEach(path => {
              path.replaceWith(setter({ SETTER, VALUE: cloneDeepWithoutLoc(path.node.right) }));
            });

            // UpdateExpressions (`count++` becomes `setCount(count() + 1)`)
            binding.constantViolations.filter(updateExpression).forEach(path => {
              if (path.node.operator === "++") path.replaceWith(add({ SETTER, GETTER, VALUE: "1" }));
              if (path.node.operator === "--") path.replaceWith(sub({ SETTER, GETTER, VALUE: "1" }));
            });
          });

          // statements.forEach(path => {
          //   const VALUE = cloneDeepWithoutLoc(path.node);
          //   path.replaceWith(reaction({ VALUE }));
          // });

          // Convert declarations (`let count = X` becomes `const [count, setCount] = rjsx.val(X)`)
          bindings.forEach(binding => {
            if (!binding.path.isVariableDeclarator()) return;
            if (!isIdentifier(binding.path.node.id)) return;

            const GETTER = binding.path.node.id.name;
            const SETTER = `set${GETTER[0].toUpperCase()}${GETTER.substring(1)}`;
            const VALUE = binding.path.node.init ? cloneDeepWithoutLoc(binding.path.node.init) : "undefined";
            const NAME = binding.path.node.id.name;

            binding.path.parentPath.replaceWith(declaration({ GETTER, SETTER, VALUE, NAME }));
          });

          // Inject runtime
          path.unshiftContainer("body", runtimeImports());

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

          console.log("\n", "Final Sourcecode", "\n", "\n", path.toString(), "\n", "\n");
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
  const [GETTER, SETTER] = rjsx.val(() => VALUE, "NAME");
`;

const getter = template.statement`
  GETTER()
`;

const setter = template.statement`
  SETTER( () => VALUE)
`;

const add = template.statement`
  SETTER( () => GETTER() + VALUE)
`;

const sub = template.statement`
  SETTER( () => GETTER() - VALUE)
`;

function getAssignmentsUsingReferences(bindings: Binding[]): NodePath<Identifier>[] {
  return bindings
    .flatMap(binding => binding.referencePaths)
    .map(path => path.getStatementParent())
    .filter(defined)
    .flatMap(path => [...getIdentifiersFromVariableDeclaration(path), ...getIdentifiersFromExpressionStatement(path)]);
}

function getIdentifiersFromVariableDeclaration(path: NodePath<Node>): NodePath<Identifier>[] {
  if (path.isVariableDeclaration()) {
    return path
      .get("declarations")
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
        });
      }
    },
  });

  return paths.filter(identifier);
}

function getBinding(path: NodePath<Node>): Binding | undefined {
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
