import { diff } from "jest-diff";
import { NodePath } from "@babel/traverse";

import type { MatcherHintOptions } from "jest-matcher-utils";

declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchSourceCode(received: any): CustomMatcherResult;
    }
  }
}

const EXPECTED_LABEL = "Expected";
const RECEIVED_LABEL = "Received";

expect.extend({
  toMatchSourceCode(received, expected) {
    const matcherName = "toMatchSourceCode";

    const options: MatcherHintOptions = {
      comment: "deep source code equality",
      isNot: this.isNot,
      promise: this.promise,
    };

    const receivedCode = getSourceCode(received);

    const pass = this.equals(receivedCode, expected, [this.utils.iterableEquality]);

    const message = pass
      ? () =>
          this.utils.matcherHint(matcherName, undefined, undefined, options) +
          "\n\n" +
          `Expected: not ${this.utils.printExpected(expected)}\n` +
          (this.utils.stringify(expected) !== this.utils.stringify(receivedCode)
            ? `Received:     ${this.utils.printReceived(receivedCode)}`
            : "")
      : () =>
          this.utils.matcherHint(matcherName, undefined, undefined, options) +
          "\n\n" +
          this.utils.printDiffOrStringify(expected, receivedCode, EXPECTED_LABEL, RECEIVED_LABEL, this.expand);

    return { actual: receivedCode, expected, message, name: matcherName, pass };
  },
});

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

function getSourceCode(received: any): string | string[] {
  if (isNodePath(received)) {
    return received.toString();
  }

  if (isBindingish(received)) {
    return received.path.toString();
  }

  if (Array.isArray(received)) {
    return received.flatMap(item => getSourceCode(item));
  }

  throw new Error(`todo type "${typeof received}"`);
}
