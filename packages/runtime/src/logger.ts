import type { Runtime } from "./runtime";

export function createLog({ transaction }: Pick<Runtime, "transaction">) {
  return function log(...data: any): void {
    console.log(...transaction.reactions.map(() => "┃"), ...data);
  };
}
