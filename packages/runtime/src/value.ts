import type { Reaction } from "./reaction";
import type { Runtime } from "./runtime";
import type { Run } from "./run";

export interface Signal<T> {
  name?: string;
  value: T;
  get: () => T;
  set: (value: (() => T) | T) => void;
  reactions: Set<Reaction>;
}

export function createValues({ transaction, react, log }: Pick<Runtime, "transaction" | "log" | "react">) {
  return function value<T>(value: (() => T) | T, name?: string): Signal<T> {
    const signal: Signal<T> = {
      value: undefined as any, //because of the very dirty setter below // isFunction(value) ? value() : value,
      reactions: new Set(),
      get: () => {
        log(`${name}.get()`);
        if (transaction.current) signal.reactions.add(transaction.current);
        return signal.value;
      },
      set: value =>
        react(() => {
          log(`${name}.set(${value})`);

          signal.value = isFunction(value) ? value() : value;
          signal.reactions.forEach(r => transaction.reactions.add(r));

          // reactions.values() returns an iterator over the reactions of the set
          const queue = transaction.reactions.values();
          let item = queue.next();

          // we iterate over the reactions until none is left and run each one
          // running a reaction can add more reactions to the set, thereby extending the set
          // while we are iterating over it
          while (!item.done) {
            transaction.reactions.delete(item.value);
            item.value.run();
            item = queue.next();
          }
        }, `${name}.set`),
    };

    // dirty and very bad hack
    signal.set(value);

    return signal;
  };
}

function isFunction<T>(value: (() => T) | T): value is () => T {
  return typeof value === "function";
}
