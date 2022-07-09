import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

describe("reactive jsx element children", () => {
  const user = userEvent.setup();

  test("x", async () => {
    let text = "lorem";
    const Button = () => <button onClick={() => (text = "ipsum")}>{text}</button>;
    const el = rjsx.render(<Button />);
    expect(el).toHaveTextContent("lorem");
    await user.click(el);
    expect(el).toHaveTextContent("ipsum");
  });
});
