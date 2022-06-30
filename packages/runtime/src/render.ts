export type Tag = keyof JSX.IntrinsicElements;

export type Component<P = {}> = (props?: P) => Element /*  | null */;

export type ElementType = Tag | Component<any>;

type A = JSX.IntrinsicElements["a"];
type X = A["href"];

export type Props<T extends ElementType = ElementType> = T extends Tag
  ? JSX.IntrinsicElements[T]
  : T extends Component<infer P>
  ? P
  : null | undefined;

export type Attrs<P extends Props> = Omit<NonNullable<P>, "children">;

export type Child = Element | string | number | boolean | null | undefined;

export interface Element<T extends ElementType = ElementType> {
  type: T;
  props: Props<T>;
  key: string | number | null;
}

export function createElement<T extends Tag | Component<Props>>(
  type: T,
  props?: Props<T>,
  ...children: Child[]
): Element<T> {
  const { key = null, ...propsWithChildren } = { ...props, children };
  return { type, props: propsWithChildren, key };
}

export function render({ type, props }: Element): HTMLElement {
  const { children = [], ...attrs } = props || {};
  if (isTag(type)) return renderTag(type, attrs, children);
  if (isComponent(type)) return renderComp(type, attrs, children);
  throw new Error(`unexpected type parameter type "${typeof type}"`);
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

function renderComp<T extends Component, P extends Props>(type: T, attrs: Attrs<P>, children: Child[]): HTMLElement {
  const el = type({ ...attrs, children });
  return render(el);
}

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

const isTag = (value: Tag | Component): value is Tag => typeof value === "string";
const isComponent = (value: Tag | Component): value is Component => typeof value === "function";
const isElement = (value: Child): value is Element =>
  typeof value === "object" && value !== null && "type" in value && "props" in value;
const isString = (value: unknown): value is string => typeof value === "string";
const isNumber = (value: unknown): value is number => typeof value === "number";
const isBoolean = (value: unknown): value is boolean => typeof value === "boolean";
const isNull = (value: unknown): value is null => value === null;
const isUndefined = (value: unknown): value is undefined => typeof value === "undefined";
