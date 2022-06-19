import type { Runtime } from './runtime';

export function createLog({ stack }: Pick<Runtime, 'stack'>) {
  return function log(...data: any): void {
    console.log(...stack.map(() => '┃'), ...data);
  };
}
