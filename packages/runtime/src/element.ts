import { reaction } from "./reactive";

import type { Tag, Element } from "./types";
import type { Read } from "./reactive";

type Props = Record<string, Read<any>>;
type Child = Read<string> | string;

export function element<T extends Tag>(tag: T, props: Props | null = null, ...children: Child[]): Element<T> {
  const element = document.createElement(tag);

  if (props) {
    Object.keys(props).forEach(name => {
      if (/^on/.test(name)) {
        element.addEventListener(name.substring(2).toLowerCase(), props[name]);
      } else {
        reaction(() => element.setAttribute(name, props[name]()));
      }
    });
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
