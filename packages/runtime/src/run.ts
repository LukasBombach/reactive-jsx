import type { Reaction } from './reaction';

export interface Run {
  stack: Reaction[];
  effects: Set<Reaction>;
}

export function createRun(): Run {
  return {
    stack: [],
    effects: new Set(),
  };
}
