export type Tag = keyof JSX.IntrinsicElements;

// todo null return
export type Component<P = {}> = (props?: P) => Element /*  | null */;

export type ElementType = Tag | Component<any>;

export type Props<T extends ElementType = ElementType> =
  | (T extends Tag
      ? Reactive<JSX.IntrinsicElements[T]>
      : T extends Component<any>
      ? Omit<Parameters<T>[0], "children">
      : never)
  | null
  | undefined;

export type Child = A<Element | string | number | boolean | null | undefined>;
export type A<T> = T | T[];
export type R<T> = T | (() => T);

export interface Element<T extends ElementType = ElementType> {
  type: T;
  props: Omit<Props<T> & { children: R<Child>[] }, "key">;
  key: string | number | null;
}

type Reactive<T> = {
  [K in keyof T]: T[K] | (() => T[K]);
} & { key?: string | number | null };

/**
 * todo typecast
 */
export function createElement<T extends Tag | Component<any>>(
  type: T,
  props?: Props<T>,
  ...children: R<Child>[]
): Element<T> {
  const { key = null, ...propsWithChildren } = { ...props, children };
  return { type, props: propsWithChildren as Omit<Props<T> & { children: R<Child>[] }, "key">, key };
}
