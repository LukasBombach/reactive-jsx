import { react } from "./reaction";
import { renderChild } from "./child";
import { isFunction } from "./typeGuards";
import { isTag, isComponent, isEventHandler } from "./typeGuards";

import type { Tag, Component, Props, Child, Element, R } from "./createElement";

type Attrs<P extends Props> = Omit<NonNullable<P>, "children">;

/**
 *
 */
export function render({ type, props }: Element): HTMLElement {
  const { children = [], ...attrs } = props || {};

  if (isComponent(type)) {
    return renderComp(type, attrs, children);
  }

  if (isTag(type)) {
    return renderTag(type, attrs, children);
  }

  throw new Error(`unexpected type parameter type "${typeof type}"`);
}

/**
 *
 */
function renderComp<T extends Component, P extends Props>(type: T, attrs: Attrs<P>, children: R<Child>[]): HTMLElement {
  const el = type({ ...attrs, children });
  return render(el);
}

/**
 *
 */
function renderTag<T extends Tag, P extends Props>(type: T, attrs: Attrs<P>, children: R<Child>[]): HTMLElement {
  const el = document.createElement(type);

  Object.entries(attrs).forEach(([name, value]) => {
    if (isEventHandler(name)) {
      el.addEventListener(name.substring(2).toLowerCase(), () => {
        //console.log("ev handler", name.substring(2).toLowerCase(), "called");
        debugger;
        value();
      });
    } else if (isFunction(value)) {
      react(() => el.setAttribute(name, value()), "attr");
    } else {
      el.setAttribute(name, value);
    }
  });

  children
    .map(child => renderChild(child))
    .flat()
    .forEach(childEl => el.append(childEl.ref));

  return el;
}
