import type { Reaction } from "./reaction";

export interface Transaction {
  queue: Set<Reaction>;
  current: Reaction | null;
}

export const transaction: Transaction = { queue: new Set(), current: null };
