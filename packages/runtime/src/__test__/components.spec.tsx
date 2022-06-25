/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import { createRuntime } from "..";

const rjsx = createRuntime();

describe("element: components", () => {
  test("html element", () => {
    const Button = () => <a href="/path">text</a>;
    const el = <Button />;
    expect(el).toBeInstanceOf(HTMLAnchorElement);
    expect(el).toHaveAttribute("href", "/path");
  });
});
