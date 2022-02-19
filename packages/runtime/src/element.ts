import { effect } from "./reactive";

import type { Tag, Element } from "./types";
import type { Read } from "./reactive";

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
