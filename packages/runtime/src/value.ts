import type { Reaction } from "./reaction";
import type { Runtime } from "./runtime";
import type { Run } from "./run";

export type Getter<T> = () => T;
export type Setter<T> = (value: T) => void;

export interface Signal<T> {
  name?: string;
  value: T;
  get: Getter<T>;
  set: Setter<T>;
  reactions: Set<Reaction>;
}

export function createValues({ transaction, react, log }: Pick<Runtime, "transaction" | "log" | "react">) {
  return function value<T>(value: T, name?: string): Signal<T> {
    const signal: Signal<T> = {
      value,
      reactions: new Set(),
      get: () => {
        log(`${name}.get()`);
        if (transaction.current) signal.reactions.add(transaction.current);
        return signal.value;
      },
      set: value => {
        log(`${name}.set(${value})`, ...[...signal.reactions].map(r => `${r.name}()`));
        signal.value = value;
        signal.reactions.forEach(r => transaction.reactions.add(r));
        while (signal.reactions.size > 0) {}
      },
    };

    return signal;
  };
}
