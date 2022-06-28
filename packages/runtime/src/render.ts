import React from "react";

type TagName = keyof JSX.IntrinsicElements;

type Component = <P = {}>(props: P) => ReactElement<any, any> | null;

interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
  type: T;
  props: P;
  key: string | number | null;
}

type JSXElementConstructor<P> = ((props: P) => ReactElement<any, any> | null) | (new (props: P) => Component<any, any>);

function createElement(
  type: string | React.FunctionComponent<{}> | React.ComponentClass<{}, any>,
  props?: React.Attributes | null | undefined,
  ...children: React.ReactNode[]
): React.ReactElement<{}, string | React.JSXElementConstructor<any>> {}
