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
} from "@babel/types";

let runs = 0;

function reactiveJsxPlugin(): { name: string; visitor: Visitor } {
  return {
    name: "Reactive JSX",
    visitor: {
      Program: {
        enter(path) {
          console.log("this is run #", ++runs);

          const bindings = getMutatedBindingsInEventHandlers(path);

          console.log(bindings.map(b => b.path.parentPath?.toString()));

          getAffectedBindings(bindings);

          console.log("\n", "Final Sourcecode", "\n", "\n", path.toString(), "\n", "\n");
        },
      },
    },
  };
}

/**
 * Bindings of variables that are being mutated though user interaction
 */
function getMutatedBindingsInEventHandlers(path: NodePath<Program>): Binding[] {
  const bindings: Binding[] = [];

  const addBinding = (path: NodePath<Node>) => {
    const binding = getBinding(path);
    if (!binding || !binding.path.isVariableDeclarator()) return;
    if (bindings.includes(binding)) return;
    bindings.push(binding);
  };

  const getBinding = (path: NodePath<Node>) => {
    if (!path.isIdentifier()) return;
    const name = path.node.name;
    return path.scope.getBinding(name);
  };

  path.traverse({
    JSXAttribute: path => {
      if (isEventHandler(path)) {
        path.traverse({
          AssignmentExpression: path => addBinding(path.get("left")),
          UpdateExpression: path => addBinding(path.get("argument")),
        });
      }
    },
  });

  return bindings;
}

/**
 * Returns the bingings of variables that are mutated though the the input bindings
 */
function getAffectedBindings(bindings: Binding[]): Binding[] {
  const affectedBindings: Binding[] = [];

  bindings
    .flatMap(binding => binding.referencePaths)
    .map(path => {
      const statement = path.getStatementParent();
      if (!statement) return;

      console.log("# statement", statement.type, statement.toString());

      // if (!statement.isVariableDeclaration()) return;
    });

  return affectedBindings;
}

function isEventHandler(path: NodePath<JSXAttribute>): boolean {
  const identifier = path.get("name").node.name;
  const name = typeof identifier === "string" ? identifier : identifier.name;
  return /^on[A-Z]/.test(name);
}

export default reactiveJsxPlugin;
