import { getByRole, getByTestId } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { render } from "@reactive-jsx/runtime";
import "@testing-library/jest-dom";

const user = userEvent.setup();

describe("components", () => {
  /* test("state & children", async () => {
    let count = 0;
    const Button = () => <button onClick={() => count++}>{count}</button>;
    const el = render(<Button />);
    expect(el).toHaveTextContent("0");
    await user.click(el);
    expect(el).toHaveTextContent("1");
  });

  test("state & attrs", async () => {
    let type: "button" | "submit" = "button";
    const Button = () => <button type={type} onClick={() => (type = "submit")} />;
    const el = render(<Button />);
    expect(el).toHaveAttribute("type", "button");
    await user.click(el);
    expect(el).toHaveAttribute("type", "submit");
  });

  test("context", async () => {
    let count = 0;
    const Button = () => <button onClick={() => count++} />;
    const P1 = () => <p data-testid="p1">{count * 2}</p>;
    const P2 = () => <p data-testid="p2">{count * 4}</p>;

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
      let count = 0;
      let double = count * 2;
      let triple;
      triple = count * 3;
      return (
        <button onClick={() => count++}>
          {count} {double} {triple}
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
      let title = "lorem";
      document.title = title;
      return <button onClick={() => (title = "ipsum")} />;
    };

    const el = render(<Button />);

    expect(spy).lastCalledWith("lorem");
    await user.click(el);
    expect(spy).lastCalledWith("ipsum");

    spy.mockRestore();
  });

  test("for statement", async () => {
    const callback = jest.fn();

    const Button = () => {
      let count = 0;

      for (let i = 0; i < count; i++) {
        callback();
      }

      return <button onClick={() => (count = 10)} />;
    };

    const el = render(<Button />);

    expect(callback).toHaveBeenCalledTimes(0);
    await user.click(el);
    expect(callback).toHaveBeenCalledTimes(10);
  }); */
});

describe("doesnt work yet", () => {
  /* test("if statement", async () => {
    const Button = () => {
      let count = 0;
      let text = "even";

      if (count % 2 === 0) {
        text = "even";
      } else {
        text = "odd";
      }

      return <button onClick={() => count++}>{text}</button>;
    };

    const el = render(<Button />);

    expect(el).toHaveTextContent("even");
    await user.click(el);
    expect(el).toHaveTextContent("odd");
  }); */
});

describe.only("fn calls", () => {
  test("function statement", async () => {
    let count = 0;

    function inc() {
      count++;
    }

    const dec = () => count--;

    const Button = () => (
      <button onMouseEnter={inc} onMouseLeave={dec}>
        {count}
      </button>
    );

    const el = render(<Button />);
    // expect(el).toHaveTextContent("0");
    // await user.click(el);
    // expect(el).toHaveTextContent("1");
  });

  /* test("function statement", async () => {
    let count = 0;
    function inc() {
      count++;
    }
    const Button = () => <button onClick={inc}>{count}</button>;
    const el = render(<Button />);
    expect(el).toHaveTextContent("0");
    await user.click(el);
    expect(el).toHaveTextContent("1");
  });

  test("function in const", async () => {
    let count = 0;
    const inc = () => count++;
    const Button = () => <button onClick={inc}>{count}</button>;
    const el = render(<Button />);
    expect(el).toHaveTextContent("0");
    await user.click(el);
    expect(el).toHaveTextContent("1");
  });

  test("fn called by fn", async () => {
    let count = 0;
    const inc = () => inc2();
    const inc2 = () => count++;
    const Button = () => <button onClick={inc}>{count}</button>;
    const el = render(<Button />);
    expect(el).toHaveTextContent("0");
    await user.click(el);
    expect(el).toHaveTextContent("1");
  }); */
});
