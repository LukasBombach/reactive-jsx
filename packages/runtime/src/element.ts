import { reaction } from "./reactive";

import type { Tag, Element } from "./types";
import type { Read } from "./reactive";

type Props = Record<string, Read<any>>;
type Child = Read<string> | string;

type EventHandler = `on${string}`;

export function element<T extends Tag>(tag: T, props: Props | null = null, ...children: Child[]): Element<T> {
  const element = document.createElement(tag);

  if (props) {
    Object.keys(props).map(name => prop(element, name, props[name]));
  }

  children
    .map(child => {
      if (typeof child === "function") {
        const text = document.createTextNode(child());
        reaction(() => (text.nodeValue = child()));
        return text;
      } else {
        const text = document.createTextNode(child);
        text.nodeValue = child;
        return text;
      }
    })
    .forEach(child => element.append(child));

  return element;
}

function prop(element: HTMLElement, name: string, value: unknown) {
  if (isEventHandler(name) && isEventListener(value)) {
    element.addEventListener(getEventName(name), value);
  } else if (isFunction(value)) {
    reaction(() => element.setAttribute(name, value()));
  } else {
    element.setAttribute(name, String(value));
  }
}

function child(child: unknown) {
  if (isNumber(child) || isBigInt(child)) {
    child = child.toString();
  }

  if (isString(child)) {
    const text = document.createTextNode(child);
    text.nodeValue = child;
    return text;
  }

  if (isFunction(child)) {
  }

  if (isBoolean(child) || isUndefined(child) || isNull(child) || isSymbol(child)) {
    return null;
  }
}

const isNumber = (value: unknown): value is number => typeof value === "number";
const isBigInt = (value: unknown): value is BigInt => typeof value === "bigint";
const isString = (value: unknown): value is string => typeof value === "string";
const isBoolean = (value: unknown): value is boolean => typeof value === "boolean";
const isUndefined = (value: unknown): value is undefined => typeof value === "undefined";
const isNull = (value: unknown): value is null => typeof value === "object" && value === null;
const isSymbol = (value: unknown): value is symbol => typeof value === "symbol";
const isFunction = (value: unknown): value is Function => typeof value === "function";
const isEventListener = (value: unknown): value is EventListener => typeof value === "function";

const isEventHandler = (name: string): name is EventHandler => /^on/.test(name);
const getEventName = (name: EventHandler): string => name.substring(2).toLowerCase();
