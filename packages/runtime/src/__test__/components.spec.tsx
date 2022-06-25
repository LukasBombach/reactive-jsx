/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import { createRuntime } from "..";

// todo this is a shit setup, I have to import this
// with this name (and not use it)
const rjsx = createRuntime();

describe("element: components", () => {
  test("html element", () => {
    const Link = () => <a href="/path">text</a>;
    const el = <Link />;
    expect(el).toBeInstanceOf(HTMLAnchorElement);
    expect(el).toHaveAttribute("href", "/path");
    expect(el).toHaveTextContent("text");
  });

  test("forward props", () => {
    const Link = (props: { href: string; children: string }) => <a href={props.href}>{props.children}</a>;
    const el = <Link href="/path">text</Link>;
    expect(el).toHaveAttribute("href", "/path");
    expect(el).toHaveTextContent("text");
  });
});
