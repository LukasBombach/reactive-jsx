import { createValues } from "./value";
import { createReactions } from "./reaction";
import { createTransaction } from "./transaction";
import { createLog } from "./logger";

export interface Runtime {
  transaction: ReturnType<typeof createTransaction>;
  value: ReturnType<typeof createValues>;
  react: ReturnType<typeof createReactions>;
  log: ReturnType<typeof createLog>;
}

export function createRuntime(): Runtime {
  const transaction = createTransaction();
  const log = createLog({ transaction });
  const react = createReactions({ transaction, log });
  const value = createValues({ transaction, react, log });
  return { transaction, value, react, log };
}
