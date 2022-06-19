import type { Reaction } from './reaction';
import type { Runtime } from './runtime';

export type Getter<T> = () => T;
export type Setter<T> = (value: T) => void;

export interface Signal<T> {
  name?: string;
  value: T;
  get: Getter<T>;
  set: Setter<T>;
  reactions: Set<Reaction>;
}

export function createValues({ stack, log }: Pick<Runtime, 'stack' | 'log'>) {
  return function value<T>(value: T, name?: string): Signal<T> {
    const signal: Signal<T> = {
      value,
      reactions: new Set(),
      get: () => {
        log(`${name}.get()`);
        const currentRun = stack[stack.length - 1];
        const currentReaction =
          currentRun?.stack?.[currentRun?.stack?.length - 1];
        if (currentReaction) {
          signal.reactions.add(currentReaction);
          currentReaction.reactingTo.add(signal);
        }
        return signal.value;
      },
      set: (value) => {
        log(
          `${name}.set(${value})`,
          ...[...signal.reactions].map((r) => `${r.name}()`)
        );
        signal.value = value;

        const currentRun = stack[stack.length - 1];

        if (currentRun) {
          currentRun.stack.push(...signal.reactions);
        } else {
          stack.push({ stack: [], effects: new Set() });
          signal.reactions.forEach((r) => {
            r.run(name);
          });
          const { effects } = stack.pop();
          effects.forEach((effect) => effect.run());
        }
      },
    };

    return signal;
  };
}
