import type { Runtime } from "./runtime";
import type { Signal } from "./value";

type TagName = keyof JSX.IntrinsicElements;
type ChildPrimive = string | number | boolean | null | undefined;

type Component = (props?: Props) => HTMLElement;
type Child = ChildPrimive | (() => ChildPrimive);
type Props = Record<string, string | Signal<any>>;

export function createDomApi({ react }: Pick<Runtime, "react">) {
  return function el(type: TagName | Component, props: Props = {}, ...children: Child[]): HTMLElement {
    if (typeof type === "string") return createElement(type, props, children);
    console.log("type is", typeof type, type);

    return type(props);
  };

  function createElement(type: TagName, props: Props, children: Child[]): HTMLElement {
    const element = document.createElement(type);
    for (const name in props) setAttribute(element, name, props[name]);
    for (const child of children) appendChild(element, child);
    return element;
  }

  function setAttribute(element: HTMLElement, name: string, value: string | Signal<any>) {
    if (/^on[A-Z]/.test(name) && typeof value === "function") {
      const eventName = name.substring(2).toLowerCase();
      element.addEventListener(eventName, value);
    } else if (typeof value === "string") {
      element.setAttribute(name, value);
    } else {
      react(() => element.setAttribute(name, value.get()), `attr ${name}`);
    }
  }

  function appendChild(element: HTMLElement, child: Child) {
    const childAsFn = typeof child === "function" ? child : () => child;
    reconcile(element, childAsFn);
  }

  function reconcile(element: HTMLElement, child: () => ChildPrimive) {
    react<Text>(current => {
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
    }, `reconcile`);
  }
}
