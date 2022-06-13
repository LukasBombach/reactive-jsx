export type Read<T> = () => T;
export type Write<T> = (value: () => T) => void;

interface Running {
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

export function value<T>(initialValue: () => T): [read: Read<T>, write: Write<T>] {
  const subscriptions = new Set<Running>();

  let value: T = initialValue();

  const read = () => {
    const running = context[context.length - 1];
    if (running) subscribe(running, subscriptions);
    return value;
  };

  const write = (nextValue: () => T) => {
    value = nextValue();

    reaction(() => {
      for (const sub of [...subscriptions]) {
        sub.execute();
      }
    });
  };

  write(initialValue);
  // reaction(() => write(initialValue));

  return [read, write];
}

export function reaction<T>(fn: (current: T | undefined) => T) {
  let val: T;
  const execute = () => {
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
    execute,
    dependencies: new Set(),
  };

  return execute();
}
