import type { Reaction } from "./reaction";

export interface Transaction {
  reactions: Set<Reaction>;
  current: Reaction | null;
}

export function createTransaction(): Transaction {
  return { reactions: new Set(), current: null };
}
