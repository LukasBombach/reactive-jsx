export const stack: any[] = [];

export function debug(...value: any[]): void {
  stack.push(value);
}

export function clear(): void {
  stack.length = 0;
}
