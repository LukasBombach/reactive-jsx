import type { Runtime } from "./runtime";

export function createLog({ transaction }: Pick<Runtime, "transaction">) {
  return function log(...data: any): void {
    // const stackSize = transaction.reactions.size + Number(Boolean(transaction.current));
    // console.log(...new Array(stackSize).fill("┃"), ...data);
  };
}
