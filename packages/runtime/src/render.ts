import { isFunction, isString, isNumber, isBoolean } from "./typeGuards";
import { isTag, isComponent, isElement } from "./typeGuards";
import { isNull, isUndefined } from "./typeGuards";

import type { Tag, Component, Props, Child, Element } from "./createElement";

type Attrs<P extends Props> = Omit<NonNullable<P>, "children">;

/**
 *
 */
export function render({ type, props }: Element): HTMLElement {
  const { children = [], ...attrs } = props || {};

  if (isTag(type)) {
    return renderTag(type, attrs, children);
  }

  if (isComponent(type)) {
    return renderComp(type, attrs, children);
  }

  throw new Error(`unexpected type parameter type "${typeof type}"`);
}

/**
 *
 */
function renderTag<T extends Tag, P extends Props>(type: T, attrs: Attrs<P>, children: Child[]): HTMLElement {
  const el = document.createElement(type);

  Object.entries(attrs).forEach(([name, value]) => {
    if (isString(value)) el.setAttribute(name, value);
    else if (isFunction(value)) react(() => el.setAttribute(name, value()));
    else throw new Error(`unknown attr value type ${typeof value}`);
  });

  children.forEach(child => {
    const childEl = renderChild(child);
    el.append(childEl);
  });

  return el;
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
function renderChild(child: Child): HTMLElement | Text | Comment {
  if (isString(child) || isNumber(child)) {
    return new Text(child.toString());
  }

  if (isElement(child)) {
    return render(child);
  }

  if (isUndefined(child) || isNull(child) || isBoolean(child)) {
    return document.createComment(typeof child);
  }

  throw new Error(`unknown child type ${typeof child}`);
}
