type TagName = keyof JSX.IntrinsicElements;
type Component = (props: Props) => HTMLElement;
type Child = HTMLElement | Text;
type Props = object;

export function el(type: TagName | Component, props: Props, ...children: Child[]): HTMLElement {
  if (typeof type === "string") {
    const element = document.createElement(type);
    return element;
  }
}
