import type { Reaction } from "./reaction";

export interface Transaction {
  queue: Set<Reaction<any>>;
  current: Reaction<any> | null;
  id: number;
}

global.transactionHack = { queue: new Set(), current: null, id: Math.random() };

export const transaction: Transaction = global.transactionHack;
