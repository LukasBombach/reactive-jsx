import { reaction } from "./_old/reactive";

import type { Getter } from "./reactive";

type TagName = keyof JSX.IntrinsicElements;
type ChildPrimive = string | number | boolean | null | undefined;

type Component = (props: Props) => HTMLElement;
type Child = ChildPrimive | ((element: HTMLElement) => void);
type Props = Record<string, string | Getter<any>>;

export function el(type: TagName | Component, props: Props = {}, ...children: Child[]): HTMLElement {
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
        child(element);
      }
    }

    return element;
  }

  throw new Error("components are not supported yet");
}
