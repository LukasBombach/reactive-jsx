/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import { createRuntime } from "..";

// todo this is a shit setup, I have to import this
// with this name (and not use it)
const rjsx = createRuntime();

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
    const href = rjsx.value("/path");
    const Link = () => <a href={() => href.get()} />;
    const el = <Link />;
    expect(el).toHaveAttribute("href", "/path");
    href.set("/another/path");
    expect(el).toHaveAttribute("href", "/another/path");
  });

  test("reactive jsx element children", () => {
    const text = rjsx.value("text");
    const Link = () => <a>{() => text.get()}</a>;
    const el = <Link />;
    expect(el).toHaveTextContent("text");
    text.set("a different text");
    expect(el).toHaveTextContent("a different text");
  });
});
