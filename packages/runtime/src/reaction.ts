import { transaction } from "./transaction";
import { debug } from "./debug";

import type { Transaction } from "./transaction";

export type Reaction<T> = {
  name?: string;
  run: (from?: string) => T;
};

export function react<T>(fn: (value: T | undefined, transaction: Transaction) => T, name?: string): T {
  let value: T | undefined = undefined;
  const reaction: Reaction<T> = {
    name,
    run: from => {
      if (from) debug("run", from, ">", name);
      else debug("run", name);
      const previous = global.transactionHack.current;
      global.transactionHack.current = reaction;
      debug("global.transactionHack", global.transactionHack);
      value = fn(value);
      global.transactionHack.current = previous;
      return value;
    },
  };

  return reaction.run();
}
