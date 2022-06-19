import { createValues } from "./value";
import { createReactions } from "./reaction";
import { createLog } from "./logger";

import type { Run } from "./run";
import type { Reaction } from "./reaction";

export interface Runtime {
  stack: Reaction[];
  value: ReturnType<typeof createValues>;
  react: ReturnType<typeof createReactions>;
  log: ReturnType<typeof createLog>;
}

export function createRuntime(): Runtime {
  const stack: Reaction[] = [];
  const log = createLog({ stack });
  const react = createReactions({ stack, log });
  const value = createValues({ stack, react, log });
  return { stack, value, react, log };
}

export function getCurrentReaction(stack: Reaction[]): Reaction | null {
  return stack[stack.length - 1] || null;
}
