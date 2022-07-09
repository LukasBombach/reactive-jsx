import { transaction } from "./transaction";
import { debug } from "./debug";

export type Reaction<T> = {
  name?: string;
  run: (from?: string) => T;
};

export function react<T>(fn: (value: T | undefined) => T, name?: string): T {
  let value: T | undefined = undefined;
  const reaction: Reaction<T> = {
    name,
    run: from => {
      if (from) debug("run", from, ">", name);
      else debug("run", name);
      const previous = transaction.current;
      transaction.current = reaction;
      debug("transaction", transaction);
      value = fn(value);
      transaction.current = previous;
      return value;
    },
  };

  return reaction.run();
}
