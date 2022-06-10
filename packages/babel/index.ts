import template, { statement } from "@babel/template";
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

          const mutations = getMutatedIdentifiersInEventHandlers(path);
          const bindings = mutations.map(getBinding).filter(unique).filter(defined);

          const indirectMutations = getAssignmentsUsingReferences(bindings);
          const indirectBindings = indirectMutations.map(getBinding).filter(unique).filter(defined);

          console.log(
            "bindings",
            bindings.map(binding => binding.path.toString())
          );

          console.log(
            "indirectBindings",
            indirectBindings.map(binding => binding.path.toString())
          );

          console.log("\n", "Final Sourcecode", "\n", "\n", path.toString(), "\n", "\n");
        },
      },
    },
  };
}

function getAssignmentsUsingReferences(bindings: Binding[]): NodePath<Identifier>[] {
  return bindings
    .flatMap(binding => binding.referencePaths)
    .map(path => path.getStatementParent())
    .filter(defined)
    .flatMap(path => {
      if (path.isVariableDeclaration()) {
        return path
          .get("declarations")
          .map(path => path.get("id"))
          .filter(identifier);
      }
      if (path.isExpressionStatement()) {
        return [path.get("expression")]
          .filter((path): path is NodePath<AssignmentExpression> => path.isAssignmentExpression())
          .map(path => path.get("left"))
          .filter(identifier);
      }
    })
    .filter(defined);
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

function isEventHandler(path: NodePath<JSXAttribute>): boolean {
  const identifier = path.get("name").node.name;
  const name = typeof identifier === "string" ? identifier : identifier.name;
  return /^on[A-Z]/.test(name);
}

export default reactiveJsxPlugin;
