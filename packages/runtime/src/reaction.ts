import { getCurrentReaction } from "./runtime";

import type { Signal } from "./value";
import type { Runtime } from "./runtime";

export type Reaction = {
  name?: string;
  effects: Set<Reaction>;
  run: (from?: string) => void;
};

export function createReactions({ stack, log }: Pick<Runtime, "stack" | "log">) {
  return function react<T>(fn: () => void, name?: string): void {
    let run = 0;
    const reaction: Reaction = {
      name,
      effects: new Set(),
      run: (from?: string) => {
        log(`${from ? `${from}.` : ""}${name}()`, ++run);
        fn();
      },
    };

    reaction.run();
  };
}
