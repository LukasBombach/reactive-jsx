import { diff } from "jest-diff";
import { NodePath } from "@babel/traverse";

function isNodePath(value: unknown): value is NodePath {
  return value instanceof NodePath;
}

function isBindingish(value: any): value is { path: NodePath } {
  try {
    return isNodePath(value.path);
  } catch (error) {
    return false;
  }
}

declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchSourceCode(received: any): CustomMatcherResult;
    }
  }
}

expect.extend({
  toMatchSourceCode(received, expected) {
    const { matcherHint } = this.utils;

    const result = (pass: boolean, rec: any, exp: any) => {
      const passMessage =
        matcherHint(".not.toMatchSourceCode", undefined, undefined) +
        "\n\n" +
        "Expected value no to match source code:\n" +
        `  ${diff(exp, rec)}`;

      const failMessage =
        matcherHint(".toMatchSourceCode", undefined, undefined) +
        "\n\n" +
        "Expected value to match source code:\n" +
        `  ${diff(exp, rec)}`;

      return { pass, message: () => (pass ? passMessage : failMessage) };
    };

    if (Array.isArray(received) !== Array.isArray(expected)) {
      return result(false, received, expected);
    }

    if (isNodePath(received)) {
      const receivedSource = received.toString();
      return result(receivedSource === expected, receivedSource, expected);
    }

    if (isBindingish(received)) {
      const receivedSource = received.path.toString();
      return result(receivedSource === expected, receivedSource, expected);
    }

    if (Array.isArray(received) && Array.isArray(expected)) {
      return result(false, received, expected);
    }

    throw new Error(`todo actual type "${typeof expected}" received type "${typeof received}"`);
  },
});
