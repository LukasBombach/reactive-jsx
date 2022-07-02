import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { createElement } from "../createElement";
import { render } from "../render";

import type { Child } from "../createElement";

interface LinkProps {
  href: string;
  children: Child[];
}

describe("components", () => {
  const user = userEvent.setup();

  test("renders html element", () => {
    const Link = () => createElement("a", { href: "#/path" }, "text");
    const el = render(Link());
    expect(el).toBeInstanceOf(HTMLAnchorElement);
    expect(el).toHaveAttribute("href", "#/path");
    expect(el).toHaveTextContent("text");
  });

  test("accepts props", () => {
    const Link = ({ href, children }: LinkProps) => createElement("a", { href }, ...children);
    const el = render(Link({ href: "#/path", children: ["text"] }));
    expect(el).toHaveAttribute("href", "#/path");
    expect(el).toHaveTextContent("text");
  });

  test("reactive jsx element attributes", async () => {
    let href = "#/path";
    const Link = () => createElement("a", { href, onClick: () => (href = "#/another/path") }, "text");
    const el = render(Link());
    expect(el).toHaveAttribute("href", "#/path");
    await user.click(el);
    expect(el).toHaveAttribute("href", "#/another/path");
  });

  test("reactive jsx element children", async () => {
    let text = "text";
    const Link = () => createElement("a", { onClick: () => (text = "a different text") }, "text");
    const el = render(Link());
    expect(el).toHaveTextContent("text");
    await user.click(el);
    expect(el).toHaveTextContent("a different text");
  });
});
