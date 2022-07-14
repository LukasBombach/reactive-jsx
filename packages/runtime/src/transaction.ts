import type { Reaction } from "./reaction";

export interface Transaction {
  queue: Set<Reaction<any>>;
  current: Reaction<any> | null;
  id: number;
}

export const transaction: Transaction = { queue: new Set(), current: null, id: Math.random() };
