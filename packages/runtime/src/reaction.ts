import { transaction } from "./transaction";

export type Reaction = {
  name?: string;
  run: () => void;
};

export function react<T>(fn: (current: T | undefined) => T, name?: string): void {
  let current: T | undefined = undefined;
  const reaction: Reaction = {
    name,
    run: () => {
      const previous = transaction.current;
      transaction.current = reaction;
      current = fn(current);
      transaction.current = previous;
    },
  };

  reaction.run();
}
