export const stack: any[] = [];

export function debug(...value: any[]): void {
  console.log(value);

  stack.push(value);
}

export function clear(): void {
  stack.length = 0;
}
