import "@testing-library/jest-dom";
import { createElement, render } from "../render";

interface LinkProps {
  href: string;
  children: string;
}

const anchor = createElement("a", { href: "#/path" }, "text");
const Link = ({ href, children }: LinkProps) => createElement("a", { href }, ...children);

describe("createElement", () => {
  test("tag with attributes", () => {
    expect(anchor).toEqual({
      key: null,
      props: { children: ["text"], href: "#/path" },
      type: "a",
    });
  });

  test("component with props", () => {
    expect(createElement(Link, { href: "#/path" }, "text")).toEqual({
      key: null,
      props: { children: ["text"], href: "#/path" },
      type: Link,
    });
  });
});

describe("render", () => {
  test("tag with attributes", () => {
    const el = render(anchor);
    expect(el).toBeInstanceOf(HTMLAnchorElement);
    expect(el).toHaveAttribute("href", "#/path");
    expect(el).toHaveTextContent("text");
  });

  test("component with props", () => {
    const anchorFromLink = createElement(Link, { href: "#/path" }, "text");
    const el = render(anchorFromLink);
    expect(el).toBeInstanceOf(HTMLAnchorElement);
    expect(el).toHaveAttribute("href", "#/path");
    expect(el).toHaveTextContent("text");
  });
});
