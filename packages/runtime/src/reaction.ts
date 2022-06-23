import type { Runtime } from "./runtime";

export type Reaction = {
  name?: string;
  run: (from?: string) => void;
};

export function createReactions({ transaction, log }: Pick<Runtime, "transaction" | "log">) {
  return function react<T>(fn: (current: T | undefined) => T, name?: string): void {
    let current: T | undefined = undefined;
    const reaction: Reaction = {
      name,
      run: (from?: string) => {
        log(`react(${from ? `${from}.` : ""}${name})`);
        transaction.current = reaction;
        current = fn(current);
        transaction.current = null;
        console.log("");
      },
    };

    reaction.run();
  };
}
