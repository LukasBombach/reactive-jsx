import { createValues } from "./value";
import { createReactions } from "./reaction";
import { createTransaction } from "./transaction";
import { createLog } from "./logger";

import type { Run } from "./run";
import type { Transaction } from "./transaction";
import type { Reaction } from "./reaction";

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
