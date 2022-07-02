import "@testing-library/jest-dom";
import { createElement } from "../createElement";
import { render } from "../render";

import type { Child } from "../createElement";

interface LinkProps {
  href: string;
  children: Child[];
}

const anchor = createElement("a", { href: "#/path" }, "text");
const Link = ({ href, children }: LinkProps) =>
  createElement("a", { href }, ...children);

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

describe("createElement with children", () => {
  test("nested tags and components", () => {
    const text1 = createElement("p", null, "text1");
    const text2 = createElement("p", null, "text2");
    const link = createElement(Link, { href: "#/path" }, "text");
    const div = createElement("div", null, text1, link, text2);

    expect(div).toEqual({
      key: null,
      props: {
        children: [
          {
            key: null,
            props: {
              children: ["text1"],
            },
            type: "p",
          },
          {
            key: null,
            props: { children: ["text"], href: "#/path" },
            type: Link,
          },
          {
            key: null,
            props: {
              children: ["text2"],
            },
            type: "p",
          },
        ],
      },
      type: "div",
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

describe("render with children", () => {
  test("nested tags and components", () => {
    const text1 = createElement("p", null, "text1");
    const text2 = createElement("p", null, "text2");
    const link = createElement(Link, { href: "#/path" }, "text");
    const div = createElement("div", null, text1, link, text2);

    expect(render(div)).toMatchInlineSnapshot(`
      <div>
        <p>
          text1
        </p>
        <a
          href="#/path"
        >
          text
        </a>
        <p>
          text2
        </p>
      </div>
    `);
  });

  test("deeply nested tags and components", () => {
    const Container = (props?: { children: Child[] }) =>
      createElement("div", null, ...(props?.children || []));
    const text = createElement("p", null, "text");

    const DeeplyNestedComponent = () =>
      Container({
        children: [
          text,
          Container({
            children: [text, Container({ children: [text] }), text],
          }),
          text,
        ],
      });

    expect(render(DeeplyNestedComponent())).toMatchInlineSnapshot(`
      <div>
        <p>
          text
        </p>
        <div>
          <p>
            text
          </p>
          <div>
            <p>
              text
            </p>
          </div>
          <p>
            text
          </p>
        </div>
        <p>
          text
        </p>
      </div>
    `);
  });
});
