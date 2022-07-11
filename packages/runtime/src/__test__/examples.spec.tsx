import { getByRole, getByTestId } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { render } from "@reactive-jsx/runtime";
import "@testing-library/jest-dom";

describe("components", () => {
  const user = userEvent.setup();

  test("state & children", async () => {
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
});
