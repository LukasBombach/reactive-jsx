import type { Reaction } from "./reaction";

export interface Transaction {
  reactions: Reaction[];
}

export function createTransaction(): Transaction {
  return { reactions: [] };
}
