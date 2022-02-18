export type Tag = keyof HTMLElementTagNameMap;
export type Element<T extends Tag> = HTMLElementTagNameMap[T];
export type Component<Props extends Record<string, unknown> = {}> = (props: Props) => Element<Tag>[];

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

export function effect(fn: () => void) {
  const execute = () => {
    cleanup(running);
    context.push(running);
    try {
      fn();
    } finally {
      context.pop();
    }
  };

  const running: Running = {
    execute,
    dependencies: new Set(),
  };

  execute();
}

type Props = Record<string, Read<any>>;
type Child = Element<Tag> | Text;

export function element<T extends Tag>(tag: T, props: Props = {}, children: () => Child[] = () => []): Element<T> {
  const element = document.createElement(tag);

  Object.keys(props).forEach(name => {
    if (/^on/.test(name)) {
      element.addEventListener(name.substring(2).toLowerCase(), props[name]);
    } else {
      effect(() => element.setAttribute(name, props[name]()));
    }
  });

  effect(() => element.replaceChildren(...children()));
  return element;
}

export function text(value: Read<string>): Text {
  const text = document.createTextNode(value());
  effect(() => (text.nodeValue = value()));
  return text;
}

interface Running {
  execute: () => void;
  dependencies: Set<Set<Running>>;
}
