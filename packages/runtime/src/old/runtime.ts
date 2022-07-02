import { createLog } from "./logger";
import { createReactions } from "./reaction";
import { createDomApi } from "./dom";
import { createValues } from "./value";
import { createTransaction } from "./transaction";

export interface Runtime {
  transaction: ReturnType<typeof createTransaction>;
  value: ReturnType<typeof createValues>;
  react: ReturnType<typeof createReactions>;
  el: ReturnType<typeof createDomApi>;
  log: ReturnType<typeof createLog>;
}

export function createRuntime(): Runtime {
  const transaction = createTransaction();
  const log = createLog({ transaction });
  const react = createReactions({ transaction, log });
  const el = createDomApi({ react });
  const value = createValues({ transaction, react, log });
  return { transaction, value, react, el, log };
}
