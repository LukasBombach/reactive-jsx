import rjsx from "@reactive-jsx/runtime";
import { getByRole, getByTestId } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { render } from "@reactive-jsx/runtime";
import "@testing-library/jest-dom";
describe("components", () => {
  const user = userEvent.setup();
  test("state & children", async () => {
    const count = rjsx.value(() => 0, "count");

    const Button = () => <button onClick={() => count.set(count.get() + 1)}>{() => count.get()}</button>;

    const el = render(<Button />);
    expect(el).toHaveTextContent("0");
    await user.click(el);
    expect(el).toHaveTextContent("1");
  });
  test("state & attrs", async () => {
    const type = rjsx.value(() => "button", "type");

    const Button = () => <button type={() => type.get()} onClick={() => type.set("submit")} />;

    const el = render(<Button />);
    expect(el).toHaveAttribute("type", "button");
    await user.click(el);
    expect(el).toHaveAttribute("type", "submit");
  });
  test("context", async () => {
    const count = rjsx.value(() => 0, "count");

    const Button = () => <button onClick={() => count.set(count.get() + 1)} />;

    const P1 = () => <p data-testid="p1">{() => count.get() * 2}</p>;

    const P2 = () => <p data-testid="p2">{() => count.get() * 4}</p>;

    const container = render(
      <div>
        <Button />
        <P1 />
        <P2 />
      </div>
    );
    expect(getByTestId(container, "p1")).toHaveTextContent("0");
    expect(getByTestId(container, "p2")).toHaveTextContent("0");
    await user.click(getByRole(container, "button"));
    expect(getByTestId(container, "p1")).toHaveTextContent("2");
    expect(getByTestId(container, "p2")).toHaveTextContent("4");
  });
  test("assignments", async () => {
    const Button = () => {
      const count = rjsx.value(() => 0, "count");
      const double = rjsx.value(() => count.get() * 2, "double");
      const triple = rjsx.value(() => undefined, "triple");
      rjsx.react(() => {
        triple.set(() => count.get() * 3);
      });
      return (
        <button onClick={() => count.set(count.get() + 1)}>
          {() => count.get()} {() => double.get()} {() => triple.get()}
        </button>
      );
    };

    const el = render(<Button />);
    expect(el).toHaveTextContent("0 0 0");
    await user.click(el);
    expect(el).toHaveTextContent("1 2 3");
    await user.click(el);
    expect(el).toHaveTextContent("2 4 6");
  });
  test("side effect", async () => {
    const spy = jest.spyOn(document, "title", "set").mockImplementation(() => {});

    const Button = () => {
      const title = rjsx.value(() => "lorem", "title");
      rjsx.react(() => {
        document.title = title.get();
      });
      return <button onClick={() => title.set("ipsum")} />;
    };

    const el = render(<Button />);
    expect(spy).lastCalledWith("lorem");
    await user.click(el);
    expect(spy).lastCalledWith("ipsum");
    spy.mockRestore();
  });
  test("if statement", async () => {
    const Button = () => {
      const count = rjsx.value(() => 0, "count");
      let text = "even";
      rjsx.react(() => {
        if (count.get() % 2 === 0) {
          text = "even";
        } else {
          text = "odd";
        }
      });
      return <button onClick={() => count.set(count.get() + 1)}>{() => text}</button>;
    };

    const el = render(<Button />);
    expect(el).toHaveTextContent("even");
    await user.click(el);
    expect(el).toHaveTextContent("odd");
  });
  test("for statement", async () => {
    const callback = jest.fn();

    const Button = () => {
      const count = rjsx.value(() => 0, "count");
      rjsx.react(() => {
        for (let i = 0; i < count.get(); i++) {
          callback();
        }
      });
      return <button onClick={() => count.set(10)} />;
    };

    const el = render(<Button />);
    expect(callback).toHaveBeenCalledTimes(0);
    await user.click(el);
    expect(callback).toHaveBeenCalledTimes(10);
  });
});
