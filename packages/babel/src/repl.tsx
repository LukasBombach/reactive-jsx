import { getByRole, getByTestId } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { render } from "@reactive-jsx/runtime";
import "@testing-library/jest-dom";

const user = userEvent.setup();

test("function statement", async () => {
  let count = 0;
  function inc() {
    count++;
  }
  const Button = () => <button onClick={() => count++}>{count}</button>;
  const el = render(<Button />);
  expect(el).toHaveTextContent("0");
  await user.click(el);
  expect(el).toHaveTextContent("1");
});
