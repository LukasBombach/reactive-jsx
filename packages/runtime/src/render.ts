// import React from "react";

// todo types
import type { ReactElement } from "react";

type Tag = keyof JSX.IntrinsicElements;

type Component<P extends Props = Record<string, never>> = (props?: P) => Element | null;

interface Element<P extends Props = Props, T extends Tag | Component = Tag | Component> {
  type: T;
  props: P;
  key: string | number | null;
}

type Props =
  | {
      children?: Child[];
    }
  | null
  | undefined;

type Attrs<P extends Props> = Omit<NonNullable<P>, "children">;

type Child = Element | string | number | boolean | null | undefined;

export function createElement(type: Tag | Component<{}>, props: Props = {}, ...children: Child[]): Element {
  const { key = null, ...propsWithChildren } = { ...props, children };
  return { type, props: propsWithChildren, key };
}

export function render({ type, props }: Element): HTMLElement {
  const { children = [], ...attrs } = props || {};
  if (isTag(type)) return renderTag(type, attrs, children);
  if (isComponent(type)) return renderComponent(type, attrs, children);
  throw new Error(`unexpected typeof type parameter "${typeof type}"`);
}

function renderTag<T extends Tag, P extends Props>(type: T, attrs: Attrs<P>, children: Child[]): HTMLElement {
  const el = document.createElement(type);

  Object.entries(attrs).forEach(([name, value]) => {
    if (isString(value)) el.setAttribute(name, value);
    else throw new Error(`unknown attr value type ${typeof value}`);
  });

  children.forEach(child => {
    const childEl = renderChild(child);
    el.append(childEl);
  });

  return el;
}

function renderComponent<T extends Component, P extends Props>(
  type: T,
  attrs: Attrs<P>,
  children: Child[]
): HTMLElement {}

function renderChild(child: Child): HTMLElement {}

const isTag = (type: Tag | Component): type is Tag => typeof type === "string";
const isComponent = (type: Tag | Component): type is Component => typeof type === "function";
const isString = (type: unknown): type is Tag => typeof type === "string";
