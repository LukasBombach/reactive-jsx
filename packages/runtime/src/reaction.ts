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

        /* const current = getCurrentReaction(stack);
        if (!current) {
          log("stack++");
          stack.push(reaction);
          fn();
          log("stack--");
          stack.pop();
          reaction.effects.forEach(effect => effect.run(name));
          reaction.effects.clear();
        } else {
          log("stack 0");
          current.effects.add(reaction);
        } */
      },
    };

    reaction.run();
  };
}

// reaction.reactingTo.forEach((signal) =>
//   signal.reactions.delete(reaction)
// );
// reaction.reactingTo.clear();

/* const currentRun = stack[stack.length - 1];

if (currentRun) {
  currentRun.stack.push(reaction);
  fn();
} else {
  stack.push({ stack: [], effects: new Set() });
  const currentRun2 = stack[stack.length - 1];
  currentRun2.stack.push(reaction);
  fn();
  const { effects } = stack.pop();
  effects.forEach((effect) => effect.run());
} */
