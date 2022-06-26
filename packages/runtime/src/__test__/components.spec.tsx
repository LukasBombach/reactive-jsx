/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";

describe("components", () => {
  test("renders html element", () => {
    const Link = () => <a href="/path">text</a>;
    const el = <Link />;
    expect(el).toBeInstanceOf(HTMLAnchorElement);
    expect(el).toHaveAttribute("href", "/path");
    expect(el).toHaveTextContent("text");
  });

  test("accepts props", () => {
    const Link = (props: { href: string; children: string }) => <a href={props.href}>{props.children}</a>;
    const el = <Link href="/path">text</Link>;
    expect(el).toHaveAttribute("href", "/path");
    expect(el).toHaveTextContent("text");
  });

  test("reactive jsx element attributes", () => {
    let href = "/path";
    const Link = () => <a href={href} />;
    const el = <Link />;
    expect(el).toHaveAttribute("href", "/path");
    href = "/another/path";
    expect(el).toHaveAttribute("href", "/another/path");
  });

  test("reactive jsx element children", () => {
    let text = "text";
    const Link = () => <a>{text}</a>;
    const el = <Link />;
    expect(el).toHaveTextContent("text");
    text = "a different text";
    expect(el).toHaveTextContent("a different text");
  });
});
