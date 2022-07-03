import { react } from "./reaction";
import { reconcile, renderChild } from "./child";
import { isFunction, isString, isNumber, isBoolean } from "./typeGuards";
import { isTag, isComponent, isElement, isReactiveChild, isEventHandler } from "./typeGuards";
import { isNull, isUndefined } from "./typeGuards";

import type { Tag, Component, Props, Child, Element } from "./createElement";

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
function renderComp<T extends Component, P extends Props>(type: T, attrs: Attrs<P>, children: Child[]): HTMLElement {
  const el = type({ ...attrs, children });
  return render(el);
}

/**
 *
 */
function renderTag<T extends Tag, P extends Props>(type: T, attrs: Attrs<P>, children: Child[]): HTMLElement {
  const el = document.createElement(type);

  Object.entries(attrs).forEach(([name, value]) => {
    if (isEventHandler(name)) {
      el.addEventListener(name.substring(2).toLowerCase(), value);
    } else if (isFunction(value)) {
      react(() => el.setAttribute(name, value()));
    } else {
      el.setAttribute(name, value);
    }
  });

  children.map(child => renderChild(child)).forEach(childEl => el.append(childEl));

  return el;
}
