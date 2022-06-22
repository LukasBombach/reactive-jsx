import type { Signal } from "./value";
import type { Runtime } from "./runtime";

export type Reaction = {
  name?: string;
  run: (from?: string) => void;
};

export function createReactions({ transaction, log }: Pick<Runtime, "transaction" | "log">) {
  return function react<T>(fn: () => void, name?: string): void {
    let run = 0;
    const reaction: Reaction = {
      name,
      run: (from?: string) => {
        log(`react(${from ? `${from}.` : ""}${name})`);
        transaction.current = reaction;
        fn();
        transaction.current = null;
        console.log("");
      },
    };

    reaction.run();
  };
}
