import rjsx from "..";

describe("element: built in elements", () => {
  test("x", () => {
    const el = rjsx.el("div");
    expect(el).toBeInstanceOf(HTMLDivElement);
  });

  test("x", () => {
    const el = rjsx.el("div");
    expect(el.attributes).toHaveLength(0);
  });

  test("x", () => {
    const el = rjsx.el("div");
    expect(el.childNodes).toHaveLength(0);
  });

  test("x", () => {
    const el = rjsx.el("div", { id: "id" });
    expect(el.getAttribute("id")).toBe("id");
  });

  test("x", () => {
    const el = rjsx.el("div", {}, "text");
    expect(el.innerText).toBe("text");
  });
});

describe("element: components", () => {});
