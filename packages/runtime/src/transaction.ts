import type { Reaction } from "./reaction";

export interface Transaction {
  effects: Reaction[];
}
