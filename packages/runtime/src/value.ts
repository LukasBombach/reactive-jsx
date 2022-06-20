import { getCurrentReaction } from "./runtime";

import type { Reaction } from "./reaction";
import type { Runtime } from "./runtime";
import type { Run } from "./run";

export type Getter<T> = () => T;
export type Setter<T> = (value: () => T) => void;

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
        const current = getCurrentReaction(stack);
        if (current) signal.reactions.add(current);
        return signal.value;
      },
      set: value =>
        react(() => {
          log(`${name}.set(${value})`, ...[...signal.reactions].map(r => `${r.name}()`));
          signal.value = value();
          while (stack.length) {
            stack.shift()?.run(name);
          }
          /* const current = getCurrentReaction(stack);
          if (current) signal.reactions.forEach(r => current.effects.add(r));
          else signal.reactions.forEach(r => r.run(name)); */
        }, `react.set.${name}`),
    };

    return signal;
  };
}

// GET
/* const currentRun = stack[stack.length - 1];
const currentReaction = currentRun?.stack?.[currentRun?.stack?.length - 1];
if (currentReaction) {
  signal.reactions.add(currentReaction);
  currentReaction.reactingTo.add(signal);
} */

// SET

/* const currentRun = stack[stack.length - 1];

if (currentRun) {
  currentRun.stack.push(...signal.reactions);
} else {
  const newRun: Run = { stack: [], effects: new Set() };
  stack.push(newRun);
  signal.reactions.forEach(r => {
    r.run(name);
  });
  newRun.effects.forEach(effect => effect.run());
} */
