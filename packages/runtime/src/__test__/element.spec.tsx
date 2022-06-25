import { createRuntime } from "..";

const rjsx = createRuntime();

describe.skip("element: built in elements", () => {
  test("a tagname returns its html element", () => {
    const el = rjsx.el("div");
    expect(el).toBeInstanceOf(HTMLDivElement);
  });

  test("no props = no attributes", () => {
    const el = rjsx.el("div");
    expect(el.attributes).toHaveLength(0);
  });

  test("no children = no childnodes", () => {
    const el = rjsx.el("div");
    expect(el.childNodes).toHaveLength(0);
  });

  test("a prop = an attribute", () => {
    const el = rjsx.el("div", { id: "id" });
    expect(el.getAttribute("id")).toBe("id");
  });

  test("a text child = the text being rendered", () => {
    const el = rjsx.el("div", {}, "text");
    expect(el.innerText).toBe("text");
  });
});

describe.skip("element: components", () => {
  test("x", () => {
    // const Comp = () => <div />;
    // const el = rjsx.el(<Comp />);
    // expect(el).toBeInstanceOf(HTMLDivElement);
  });
});
