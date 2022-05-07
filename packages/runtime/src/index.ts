import { reaction, value } from "./_old/reactive";

import type { Getter, Setter } from "./reactive";

type TagName = keyof JSX.IntrinsicElements;
type ChildPrimive = string | number | boolean | null | undefined;

type Component = (props: Props) => HTMLElement;
type Child = ChildPrimive | (() => ChildPrimive);
type Props = Record<string, string | Getter<any>>;

function el(type: TagName | Component, props: Props = {}, ...children: Child[]): HTMLElement {
  if (typeof type === "string") {
    const element = document.createElement(type);

    // Props
    for (const name in props) {
      const value = props[name];
      if (typeof value === "function") {
        reaction(() => element.setAttribute(name, value()));
      } else {
        element.setAttribute(name, value);
      }
    }

    // Children
    for (const child of children) {
      if (typeof child === "string") {
        const text = document.createTextNode(child);
        element.append(text);
      }

      if (typeof child === "number") {
        const text = document.createTextNode(child.toString());
        element.append(text);
      }

      if (typeof child === "function") {
        reaction(() => {
          const value = child();

          console.log(value);

          if (typeof value === "string") {
            const text = document.createTextNode(value);
            element.append(text);
          }

          if (typeof value === "number") {
            const text = document.createTextNode(value.toString());
            element.append(text);
          }
        });
      }
    }

    return element;
  } else {
    return type(props);
  }
}

function val<T>(initialValue: T): [getter: Getter<T>, setter: Setter<T>] {
  //return value(initialValue);
  return [() => initialValue, () => {}];
}

export default { el, val };
