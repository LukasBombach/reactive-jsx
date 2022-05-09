import { reaction } from "./_old/reactive";

import type { Getter } from "./reactive";

type TagName = keyof JSX.IntrinsicElements;
type ChildPrimive = string | number | boolean | null | undefined;

type Component = (props: Props) => HTMLElement;
type Child = ChildPrimive | (() => ChildPrimive);
type Props = Record<string, string | Getter<any>>;

export function el(type: TagName | Component, props: Props = {}, ...children: Child[]): HTMLElement {
  if (typeof type === "string") return createElement(type, props, children);
  return type(props);
}

function createElement(type: TagName, props: Props, children: Child[]): HTMLElement {
  const element = document.createElement(type);
  for (const name in props) setAttribute(element, name, props[name]);
  for (const child of children) appendChild(element, child);
  return element;
}

function setAttribute(element: HTMLElement, name: string, value: string | Getter<any>) {
  if (/^on[A-Z]/.test(name) && typeof value === "function") {
    const eventName = name.substring(2).toLowerCase();
    element.addEventListener(eventName, value);
  } else if (typeof value === "function") {
    reaction(() => element.setAttribute(name, value()));
  } else {
    element.setAttribute(name, value);
  }
}

function appendChild(element: HTMLElement, child: Child) {
  const childAsFn = typeof child === "function" ? child : () => child;
  reconcile(element, childAsFn);
}

function reconcile(element: HTMLElement, child: () => ChildPrimive) {
  reaction<Text>(current => {
    const value = child();

    if (typeof value === "string" || typeof value === "number") {
      if (!current) {
        const text = document.createTextNode(value.toString());
        element.append(text);
        return text;
      } else {
        current.textContent = value.toString();
        return current;
      }
    }

    throw new Error(`Cannot handle type ${typeof value}`);
  });
}
