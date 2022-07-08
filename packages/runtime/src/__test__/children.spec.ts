import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { value } from "../value";
import { renderChild } from "../child";

describe("components", () => {
  test("static string", () => {
    const { ref } = renderChild("text");
    expect(ref).toHaveTextContent("text");
  });

  test("reactive string", () => {
    const val = value("a");
    const { ref } = renderChild(val.get);
    expect(ref).toHaveTextContent("a");
    val.set("b");
    expect(ref).toHaveTextContent("b");
  });

  test("reactive number", () => {
    const val = value(1);
    const { ref } = renderChild(val.get);
    expect(ref).toHaveTextContent("1");
    val.set(2);
    expect(ref).toHaveTextContent("2");
  });

  test("reactive boolean", () => {
    const val = value(true);
    const { ref } = renderChild(val.get);
    expect(ref).toHaveTextContent("true");
    val.set(false);
    expect(ref).toHaveTextContent("false");
  });
});
