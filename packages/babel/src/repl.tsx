import { getByRole, getByTestId } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { render } from "@reactive-jsx/runtime";
import "@testing-library/jest-dom";

const user = userEvent.setup();

test("fn called by fn", async () => {
  let count = 0;
  const inc = () => inc2();
  const inc2 = () => count++;
  const Button = () => <button onClick={inc}>{count}</button>;
  const el = render(<Button />);
  expect(el).toHaveTextContent("0");
  await user.click(el);
  expect(el).toHaveTextContent("1");
});
