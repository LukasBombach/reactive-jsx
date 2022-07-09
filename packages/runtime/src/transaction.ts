import type { Reaction } from "./reaction";

export interface Transaction {
  queue: Set<Reaction<any>>;
  current: Reaction<any> | null;
}

export const transaction: Transaction = { queue: new Set(), current: null };
