import { transaction } from "./transaction";
import { react } from "./reaction";
import { isFunction } from "./typeGuards";

import type { Reaction } from "./reaction";

export interface Signal<T> {
  name?: string;
  value: T;
  get: () => T;
  set: (value: (() => T) | T) => void;
  reactions: Set<Reaction>;
}

export function value<T>(value: (() => T) | T, name?: string): Signal<T> {
  const signal: Signal<T> = {
    value: undefined as any, //because of the very dirty setter below // isFunction(value) ? value() : value,
    reactions: new Set(),
    get: () => {
      // todo prevent recursion when this getter is inside its setter here
      if (transaction.current) signal.reactions.add(transaction.current);
      return signal.value;
    },
    set: value =>
      react(() => {
        signal.value = isFunction(value) ? value() : value;
        signal.reactions.forEach(r => transaction.queue.add(r));

        // queue.values() returns an iterator over the reactions of the set
        const queue = transaction.queue.values();
        let item = queue.next();

        // we iterate over the reactions until none is left and run each one
        // running a reaction can add more reactions to the set, thereby extending the set
        // while we are iterating over it
        // 📌 This ends up working through the reaction tree depth-first
        while (!item.done) {
          transaction.queue.delete(item.value);
          item.value.run();
          item = queue.next();
        }
      }),
  };

  // dirty and very bad hack
  // todo explain why, you doofus
  signal.set(value);

  return signal;
}
