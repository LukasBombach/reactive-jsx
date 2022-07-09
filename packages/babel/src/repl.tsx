import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { render } from "../render";

describe("components", () => {
  const user = userEvent.setup();

  test("reactive jsx element children", async () => {
    let text = "text";
    const Button = () => <button onClick={() => (text = "a different text")}>{text}</button>;
    const el = render(<Button />);
    expect(el).toHaveTextContent("text");
    await user.click(el);
    text = "a different text";
    expect(el).toHaveTextContent("a different text");
  });
});
