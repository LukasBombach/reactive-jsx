import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { value } from "../value";
import { createElement } from "../createElement";
import { render } from "../render";
import { renderChild } from "../child";

import type { Element } from "../createElement";

describe("components", () => {
  test("static string", () => {
    const { ref } = renderChild("text");
    expect(ref).toBeInstanceOf(Text);
    expect(ref).toHaveTextContent("text");
  });

  test("reactive string", () => {
    const val = value("a");
    const { ref } = renderChild(val.get);
    expect(ref).toBeInstanceOf(Text);
    expect(ref).toHaveTextContent("a");
    val.set("b");
    expect(ref).toBeInstanceOf(Text);
    expect(ref).toHaveTextContent("b");
  });

  test("reactive number", () => {
    const val = value(1);
    const { ref } = renderChild(val.get);
    expect(ref).toBeInstanceOf(Text);
    expect(ref).toHaveTextContent("1");
    val.set(2);
    expect(ref).toBeInstanceOf(Text);
    expect(ref).toHaveTextContent("2");
  });

  test("reactive boolean", () => {
    const val = value(true);
    const { ref } = renderChild(val.get);
    expect(ref).toBeInstanceOf(Comment);
    expect(ref).toHaveTextContent("true");
    val.set(false);
    expect(ref).toBeInstanceOf(Comment);
    expect(ref).toHaveTextContent("false");
  });

  test("reactive null & undefined", () => {
    const val = value<null | undefined>(null);
    const { ref } = renderChild(val.get);
    expect(ref).toBeInstanceOf(Comment);
    expect(ref).toHaveTextContent("null");
    val.set(undefined);
    expect(ref).toBeInstanceOf(Comment);
    expect(ref).toHaveTextContent("");
  });

  test("reactive JSX Element", () => {
    const parent = document.createDocumentFragment();
    const val = value<Element<"div" | "span">>(createElement("div"));
    const { ref } = renderChild(val.get);
    parent.append(ref);
    expect(parent.firstElementChild).toBeInstanceOf(HTMLDivElement);
    val.set(createElement("span"));
    expect(parent.firstElementChild).toBeInstanceOf(HTMLSpanElement);
  });

  test("reactive JSX Array", () => {
    const parent = document.createElement("div");
    const val = value(["a", "b"]);
    const { ref } = renderChild(val.get);
    parent.append(...ref);
    expect(parent).toHaveTextContent("ab");
    val.set(["c", "d"]);
    expect(parent).toHaveTextContent("cd");
    val.set(["e", "f", "g", "h"]);
    expect(parent).toHaveTextContent("efgh");
  });

  test("x", () => {
    const text = value(() => "text");
    const button = render(createElement("button", {}, () => text.get()));
    expect(button).toHaveTextContent("text");
    text.set("a different text");
    expect(button).toHaveTextContent("a different text");
  });
});
