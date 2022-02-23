import { reaction } from "./reactive";

import type { Tag, Element } from "./types";
import type { Read } from "./reactive";

type Props = Record<string, Read<any>>;
type Child = Read<string> | string;

type EventHandler = `on${string}`;

const isNumber = (value: unknown): value is number => typeof value === "number";
const isBigInt = (value: unknown): value is BigInt => typeof value === "bigint";
const isString = (value: unknown): value is string => typeof value === "string";
const isFunction = (value: unknown): value is Function => typeof value === "function";
const isEventListener = (value: unknown): value is EventListener => typeof value === "function";
const isEventHandler = (name: string): name is EventHandler => /^on/.test(name);
const getEventName = (name: EventHandler): string => name.substring(2).toLowerCase();

export function element<T extends Tag>(tag: T, props: Props | null = null, ...children: Child[]): Element<T> {
  const element = document.createElement(tag);

  if (props) {
    Object.keys(props).map(name => setAttribute(element, name, props[name]));
  }

  children.forEach(child => append(element, child));

  return element;
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

function append(element: HTMLElement, child: unknown) {
  if (isNumber(child) || isBigInt(child)) {
    child = child.toString();
  }

  if (isString(child)) {
    const text = document.createTextNode(child);
    text.nodeValue = child;
    element.append(text);
  }

  if (isFunction(child)) {
    return reconcile(element, child);
  }
}

function reconcile(element: HTMLElement, child: Function) {
  const text = document.createTextNode(child());
  reaction(() => (text.nodeValue = child()));
  element.append(text);
}
