import userEvent from "@testing-library/user-event";
import { render } from "@reactive-jsx/runtime";
import "@testing-library/jest-dom";

describe("components", () => {
  const user = userEvent.setup();

  test("renders html element", () => {
    const Link = () => <a href="#/path">text</a>;
    const el = render(<Link />);
    expect(el).toBeInstanceOf(HTMLAnchorElement);
    expect(el).toHaveAttribute("href", "#/path");
    expect(el).toHaveTextContent("text");
  });

  test("accepts props", () => {
    const Link = (props: { href: string; children: string }) => <a href={props.href}>{props.children}</a>;
    const el = render(<Link href="#/path">text</Link>);
    expect(el).toHaveAttribute("href", "#/path");
    expect(el).toHaveTextContent("text");
  });

  test("reactive jsx element attributes", async () => {
    let href = "#/path";
    const Link = () => <a href={href} onClick={() => (href = "#/another/path")} />;
    const el = render(<Link />);
    expect(el).toHaveAttribute("href", "#/path");
    await user.click(el);
    expect(el).toHaveAttribute("href", "#/another/path");
  });

  test("reactive jsx element children", async () => {
    let text = "lorem";
    const Link = () => <a onClick={() => (text = "ipsum")}>{text}</a>;
    const el = render(<Link />);
    expect(el).toHaveTextContent("lorem");
    await user.click(el);
    expect(el).toHaveTextContent("ipsum");
  });
});
