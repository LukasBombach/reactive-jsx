export type Tag = keyof JSX.IntrinsicElements;

// todo null return
export type Component<P = {}> = (props?: P) => Element /*  | null */;

export type ElementType = Tag | Component<any>;

export type Props<T extends ElementType = ElementType> =
  | (T extends Tag ? JSX.IntrinsicElements[T] : T extends Component<any> ? Omit<Parameters<T>[0], "children"> : never)
  | null
  | undefined;

export type Child = Element | string | number | boolean | null | undefined;

export interface Element<T extends ElementType = ElementType> {
  type: T;
  props: Omit<Props<T> & { children: Child[] }, "key">;
  key: string | number | null;
}

/**
 * todo typecast
 */
export function createElement<T extends Tag | Component<any>>(
  type: T,
  props?: Props<T>,
  ...children: Child[]
): Element<T> {
  const { key = null, ...propsWithChildren } = { ...props, children };
  return { type, props: propsWithChildren as Omit<Props<T> & { children: Child[] }, "key">, key };
}
