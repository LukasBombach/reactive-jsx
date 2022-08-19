import "./jest.extend";

describe("transitive assignments", () => {
  expect(`
    const count = 1;
    const handler = () => count++;
    const Button = () => <Button onClick={handler} />
  `).toBeTransformedTo(`
    const [getCount, setCount] = rsjx.value(1);
    const handler = () => setCount(getCount() + 1);
    const Button = () => <Button onClick={handler} />
  `);

  expect(`
    const count = 1;
    function handler() { count++; }
    const Button = () => <Button onClick={handler} />
  `).toBeTransformedTo(`
    const [getCount, setCount] = rsjx.value(1);
    function handler() { setCount(getCount() + 1); }
    const Button = () => <Button onClick={handler} />
  `);

  expect(`
    const count = 1;
    const handler = () => handler2();
    const handler2 = () => count++;
    const Button = () => <Button onClick={handler} />
  `).toBeTransformedTo(`
    const [getCount, setCount] = rsjx.value(1);
    const handler = () => handler2();
    const handler2 = () => setCount(getCount() + 1);
    const Button = () => <Button onClick={handler} />
  `);

  expect(`
    const count = 1;
    const handler = () => handler2();
    const handler2 = () => handler3();
    const handler3 = () => count++;
    const Button = () => <Button onClick={handler} />
  `).toBeTransformedTo(`
    const [getCount, setCount] = rsjx.value(1);
    const handler = () => handler2();
    const handler2 = () => handler3();
    const handler3 = () => setCount(getCount() + 1);
    const Button = () => <Button onClick={handler} />
  `);
});
