import { getCurrentReaction } from "./runtime";

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

export function createValues({ stack, react, log }: Pick<Runtime, "stack" | "log" | "react">) {
  return function value<T>(value: T, name?: string): Signal<T> {
    const signal: Signal<T> = {
      value,
      reactions: new Set(),
      get: () => {
        log(`${name}.get()`);
        return signal.value;
      },
      set: value =>
        react(() => {
          log(`${name}.set(${value})`, ...[...signal.reactions].map(r => `${r.name}()`));
          signal.value = value;
          while (stack.length) {
            stack.shift()?.run(name);
          }
        }, `react.set.${name}`),
    };

    return signal;
  };
}
