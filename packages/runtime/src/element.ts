import { reaction } from "./reactive";

import type { Tag, Element } from "./types";
import type { Read } from "./reactive";

type Props = Record<string, Read<any>>;
type Child = Read<string> | string;

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
  if (/^on/.test(name)) {
    assertFunction(name, value);
    element.addEventListener(name.substring(2).toLowerCase(), value);
  } else if (typeof value === "function") {
    reaction(() => element.setAttribute(name, value()));
  } else {
    element.setAttribute(name, String(value));
  }
}

function assertFunction(name: string, value: unknown): asserts value is EventListener {
  if (typeof value !== "function") throw new Error(`${name} must be a function, got ${typeof value}`);
}
