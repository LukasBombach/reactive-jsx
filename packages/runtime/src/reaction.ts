import type { Signal } from './value';
import type { Runtime } from './runtime';

export type Reaction = {
  name?: string;
  reactingTo: Set<Signal<any>>;
  run: (from?: string) => void;
};

export function createReactions({
  stack,
  log,
}: Pick<Runtime, 'stack' | 'log'>) {
  return function react<T>(fn: () => void, name?: string): void {
    let run = 0;
    const reaction: Reaction = {
      name,
      reactingTo: new Set(),
      run: (from?: string) => {
        // reaction.reactingTo.forEach((signal) =>
        //   signal.reactions.delete(reaction)
        // );
        // reaction.reactingTo.clear();
        log(`${from ? `${from}.` : ''}${name}()`, ++run);

        const currentRun = stack[stack.length - 1];

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
        }
      },
    };

    reaction.run();
  };
}
