import template from "@babel/template";
import {
  isIdentifier,
  isConditionalExpression,
  isAssignmentExpression,
  isJSXExpressionContainer,
  isJSXIdentifier,
  cloneDeepWithoutLoc,
} from "@babel/types";

import type { NodePath, Node } from "@babel/core";
import type { PluginObj } from "@babel/core";
import type { Statement } from "@babel/types";

function assertNodePath(value: NodePath | NodePath[]): asserts value is NodePath {
  if (Array.isArray(value)) throw new TypeError(`${value} should not be an array`);
}

function assertStatement(value: Statement | Statement[]): asserts value is Statement {
  if (Array.isArray(value)) throw new TypeError(`${value} should not be an array`);
}

const signal = template`
  const [GETTER, SETTER] = ReactiveJsx.signal(VALUE);
`;

const setter = template`
  SETTER(VALUE)
`;

const getter = template`
  GETTER()
`;

// todo effects don't return, that's computeds
const effect = template`
ReactiveJsx.effect(() => { return EXPRESSION })
`;

const libImport = template.ast(`
  import ReactiveJsx from "@reactive-jsx/runtime";
`);

export const reactiveProps = (): PluginObj => ({
  visitor: {
    JSXAttribute: {
      exit(path) {
        const namePath = path.get("name");
        if (isJSXIdentifier(namePath.node)) {
          const { name } = namePath.node;
          if (!/^on/.test(name)) {
            reactiveIdentifier(path.get("value.expression"));
          }
        }
      },
    },
  },
});

export const reactiveChildren = (): PluginObj => ({
  visitor: {
    JSXElement: {
      exit(path) {
        path.get("children").forEach(child => {
          if (isJSXExpressionContainer(child)) {
            const expressionPath = child.get("expression");
            assertNodePath(expressionPath);
            if (isConditionalExpression(expressionPath.node)) {
              const EXPRESSION = expressionPath.node;

              const ast = effect({
                EXPRESSION,
              });
              assertStatement(ast);
              expressionPath.replaceWith(ast);
            } else if (isIdentifier(expressionPath.node)) {
              reactiveIdentifier(expressionPath);
            }
          }
        });
      },
    },
  },
});

const reactiveIdentifier = (path: NodePath<Node> | NodePath<Node>[]) => {
  assertNodePath(path);
  if (isIdentifier(path.node)) {
    const { name } = path.node;
    const binding = path.scope.bindings[name];
    const valuePath = binding.path.get("init");
    assertNodePath(valuePath);

    const GETTER = name;
    const SETTER = `set${name[0].toUpperCase()}${name.substring(1)}`;
    const VALUE = cloneDeepWithoutLoc(valuePath.node);

    const ast = signal({
      GETTER,
      SETTER,
      VALUE,
    });

    assertStatement(ast);

    binding.path.parentPath?.replaceWith(ast);

    binding.referencePaths
      .filter(r => r !== path)
      .forEach(r => {
        if (isIdentifier(r.node)) {
          const GETTER = r.node.name;

          const ast = getter({
            GETTER,
          });
          assertStatement(ast);
          r.replaceWith(ast);
        }
      });

    binding.constantViolations.forEach(v => {
      if (isAssignmentExpression(v.node)) {
        const VALUE = cloneDeepWithoutLoc(v.node.right);

        const ast = setter({
          SETTER,
          VALUE,
        });
        assertStatement(ast);
        v.replaceWith(ast);
      }
    });
  }
};

export const insertImports = (): PluginObj => ({
  visitor: {
    Program(path) {
      path.unshiftContainer("body", libImport);
    },
  },
});
