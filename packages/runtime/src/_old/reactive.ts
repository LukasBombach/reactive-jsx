export type Read<T> = () => T;
export type Write<T> = (value: () => T) => void;

interface Running {
  name?: string;
  execute: () => void;
  dependencies: Set<Set<Running>>;
}

const context: Running[] = [];

function subscribe(running: Running, subscriptions: Set<Running>) {
  subscriptions.add(running);
  running.dependencies.add(subscriptions);
}

function cleanup(running: Running) {
  for (const dep of running.dependencies) {
    dep.delete(running);
  }
  running.dependencies.clear();
}

export function value<T>(initialValue: () => T, name?: string): [read: Read<T>, write: Write<T>] {
  const subscriptions = new Set<Running>();

  let value: T = initialValue();

  const read = () => {
    console.log("reading", name);
    const running = context[context.length - 1];
    if (running) subscribe(running, subscriptions);
    return value;
  };

  const write = (nextValue: () => T) =>
    reaction(() => {
      debugger;
      console.log("writing", name);
      value = nextValue();

      for (const sub of [...subscriptions]) {
        sub.execute();
      }
    }, name);

  console.log("declaring", name);
  write(initialValue);
  //reaction(() => write(initialValue));

  return [read, write];
}

export function reaction<T>(fn: (current: T | undefined) => T, name?: string) {
  let val: T;
  const execute = () => {
    console.log("reacting", running.name);
    cleanup(running);
    context.push(running);
    try {
      val = fn(val);
    } finally {
      context.pop();
    }
    return val;
  };

  const running: Running = {
    name,
    execute,
    dependencies: new Set(),
  };

  return execute();
}
