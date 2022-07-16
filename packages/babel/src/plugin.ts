import { getEventHandlers } from "./eventHandlers";

import type { NodePath, Node, Visitor } from "@babel/core";
import type { Binding } from "@babel/traverse";
import type {
  ArrowFunctionExpression,
  AssignmentExpression,
  ExpressionStatement,
  FunctionDeclaration,
  FunctionExpression,
  Identifier,
  VariableDeclaration,
} from "@babel/types";

type SomeKindOfFunction = ArrowFunctionExpression | FunctionExpression | FunctionDeclaration;

export default function reactiveJsxPlugin(): { name: string; visitor: Visitor } {
  return {
    name: "Reactive JSX",
    visitor: {
      Program: {
        enter(path) {
          const eventHandlers = getEventHandlers(path);

          const mutatedVariables = eventHandlers
            .flatMap(getMutatedVariables)
            .map(getDeclaration)
            .filter(isNonNullable)
            .filter(unique);

          const assignedVariables = mutatedVariables
            .flatMap(getAssignments)
            .map(getDeclaration)
            .filter(isNonNullable)
            .filter(unique);

          const declarations = [...mutatedVariables, ...assignedVariables].filter(unique);
          const getters = declarations.flatMap(getGetters);
          const setters = declarations.flatMap(getSetters);
          const statements = declarations.flatMap(getStatements);
        },
      },
    },
  };
}

function getDeclaration(path: NodePath<Identifier>): Binding | undefined {
  const name = path.node.name;
  return path.scope.getBinding(name);
}

function getAssignments(path: Binding): NodePath<Identifier>[] {
  const statements = path.referencePaths.map(path => path.getStatementParent()).filter(isNonNullable);

  const fromVariableDeclaration = statements
    .filter(isVariableDeclaration)
    .flatMap(path => path.get("declarations"))
    .map(path => path.get("id"))
    .filter(isIdentifier);

  const fromExpressionStatement = statements
    .filter(isExpressionStatement)
    .map(path => path.get("expression"))
    .filter(isAssignmentExpression)
    .map(path => path.get("left"))
    .filter(isIdentifier);

  return [...fromVariableDeclaration, ...fromExpressionStatement];
}

function getStatements(path: Binding): NodePath<Statement>[] {}

function getGetters(path: Binding): NodePath<Node>[] {
  return path.referencePaths;
}

function getSetters(path: Binding): NodePath<Node>[] {
  return path.constantViolations;
}

function getMutatedVariables(path: NodePath<SomeKindOfFunction>): NodePath<Identifier>[] {
  const identifiers: NodePath<Identifier>[] = [];

  path.traverse({
    AssignmentExpression: path => {
      const left = path.get("left");
      if (left.isIdentifier()) identifiers.push(left);
    },
    UpdateExpression: path => {
      const argument = path.get("argument");
      if (argument.isIdentifier()) identifiers.push(argument);
    },
    CallExpression: path => {
      const callee = path.get("callee");
      const fn = getFunction(callee);
      if (fn) identifiers.push(...getMutatedVariables(fn));
    },
  });

  return identifiers;
}

function getFunction(path: NodePath<Node>): NodePath<SomeKindOfFunction> | undefined {
  if (!path.isIdentifier()) return;
  const binding = path.scope.getBinding(path.node.name);
  if (!binding) return;

  if (binding.path.isFunctionDeclaration()) {
    return binding.path;
  }

  if (binding.path.isVariableDeclarator()) {
    const init = binding.path.get("init");
    if (!init) return;
    if (init.isArrowFunctionExpression() || init.isFunctionExpression()) {
      return init;
    }
  }
}

function unique<T>(value: T, index: number, array: T[]): boolean {
  return array.indexOf(value) === index;
}

function isNonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

function isVariableDeclaration(path: NodePath<Node>): path is NodePath<VariableDeclaration> {
  return path.isVariableDeclaration();
}

function isExpressionStatement(path: NodePath<Node>): path is NodePath<ExpressionStatement> {
  return path.isExpressionStatement();
}

function isIdentifier(path: NodePath<Node>): path is NodePath<Identifier> {
  return path.isIdentifier();
}

function isAssignmentExpression(path: NodePath<Node>): path is NodePath<AssignmentExpression> {
  return path.isAssignmentExpression();
}
