import { createValues } from './value';
import { createReactions } from './reaction';
import { createLog } from './logger';

import type { Run } from './run';
import type { Reaction } from './reaction';

export interface Runtime {
  stack: Run[];
  value: ReturnType<typeof createValues>;
  react: ReturnType<typeof createReactions>;
  log: ReturnType<typeof createLog>;
}

export function createRuntime(): Runtime {
  const stack: Run[] = [];
  const log = createLog({ stack });
  const value = createValues({ stack, log });
  const react = createReactions({ stack, log });
  return { stack, value, react, log };
}
