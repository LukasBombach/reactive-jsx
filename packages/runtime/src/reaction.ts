import { transaction } from "./transaction";

export type Reaction<T> = {
  run: () => T;
};

export function react<T>(fn: (value: T | undefined) => T): T {
  let value: T | undefined = undefined;
  const reaction: Reaction<T> = {
    run: () => {
      const previous = transaction.current;
      transaction.current = reaction;
      value = fn(value);
      transaction.current = previous;
      return value;
    },
  };

  return reaction.run();
}
