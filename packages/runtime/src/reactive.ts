export type Read<T> = () => T;
export type Write<T> = (value: T) => void;

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

export function signal<T>(value: T): [read: Read<T>, write: Write<T>] {
  const subscriptions = new Set<Running>();

  const read = () => {
    const running = context[context.length - 1];
    if (running) subscribe(running, subscriptions);
    return value;
  };

  const write = (nextValue: T) => {
    value = nextValue;

    for (const sub of [...subscriptions]) {
      sub.execute();
    }
  };
  return [read, write];
}

// todo effects don't return, that's computeds
export function effect<T>(fn: () => T) {
  const execute = () => {
    cleanup(running);
    context.push(running);
    let val: T;
    try {
      val = fn();
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
