import type { Reaction } from "./reaction";

export interface Transaction {
  reactions: Set<Reaction>;
  current: Reaction | null;
}

export const transaction: Transaction = { reactions: new Set(), current: null };
