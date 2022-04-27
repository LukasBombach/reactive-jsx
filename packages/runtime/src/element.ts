import { reaction } from "./reactive";

import type { Tag, Element } from "./types";
import type { Read } from "./reactive";

type Props = Record<string, Read<any>>;
// type Child = Read<string> | string;
type Child = ((parent: HTMLElement) => void) | string | number;

type EventHandler = `on${string}`;

const isNumber = (value: unknown): value is number => typeof value === "number";
const isBigInt = (value: unknown): value is BigInt => typeof value === "bigint";
const isString = (value: unknown): value is string => typeof value === "string";
const isFunction = (value: unknown): value is Function => typeof value === "function";
const isUndefined = (value: unknown): value is undefined => typeof value === "undefined";
const isElement = (value: unknown): value is HTMLElement => value instanceof HTMLElement;

const isEventListener = (value: unknown): value is EventListener => typeof value === "function";
const isEventHandler = (name: string): name is EventHandler => /^on/.test(name);
const getEventName = (name: EventHandler): string => name.substring(2).toLowerCase();

const isTextNode = (node: Node): node is Text => node.nodeType === 3;

export function element<T extends Tag | (() => HTMLElement)>(
  tag: T,
  props: Props | null = null,
  ...children: Child[]
): T extends Tag ? Element<T> : HTMLElement {
  if (isFunction(tag)) {
    return (tag as any)(props);
  } else {
    const element = document.createElement(tag);

    if (props) {
      Object.keys(props).map(name => setAttribute(element, name, props[name]));
    }

    // children.forEach(child => append(element, child));
    children.forEach(child => {
      if (typeof child === "function") {
        child(element);
      } else {
        const text = document.createTextNode(child.toString());
        element.append(text);
      }
    });

    return element as any;
  }
}

export function child<T>(fn: () => void): Child {
  return (parent: HTMLElement) => {
    reaction<Node | undefined>(current => {
      return reconcile(parent, current, fn());
    });
  };
}

function setAttribute(element: HTMLElement, name: string, value: unknown) {
  if (isEventHandler(name) && isEventListener(value)) {
    element.addEventListener(getEventName(name), value);
  } else if (isFunction(value)) {
    reaction(() => element.setAttribute(name, value()));
  } else {
    element.setAttribute(name, String(value));
  }
}

/* function append(element: HTMLElement, child: unknown) {
  if (isString(child) || isNumber(child) || isBigInt(child)) {
    const text = document.createTextNode(child.toString());
    element.append(text);
  } else if (isElement(child)) {
    element.append(child);
  } else if (isFunction(child)) {
    reaction<Node | undefined>(current => {
      if (!isFunction(child)) {
        throw new Error(`expected "${child}" to be a function, but it is typeof ${typeof child}`);
      }
      return reconcile(element, current, child());
    });
  }
} */

function reconcile(element: HTMLElement, current: Node | undefined, next: unknown): Node {
  if (isNumber(next) || isBigInt(next)) {
    next = next.toString();
  }

  if (isString(next)) {
    if (isUndefined(current)) {
      const text = document.createTextNode(next);
      element.append(text);
      return text;
    } else if (isTextNode(current)) {
      if (next !== current.nodeValue) {
        current.nodeValue = next;
      }
      return current;
    } else {
      const text = document.createTextNode(next);
      element.replaceChild(text, current);
      return text;
    }
  } else if (isElement(next)) {
    if (next !== current) {
      if (isUndefined(current)) {
        element.append(next);
      } else {
        element.replaceChild(next, current);
      }
    }
    return next;
  } else {
    throw new Error(`cannot handle type "${typeof next}": ${JSON.stringify(next)}`);
  }
}
