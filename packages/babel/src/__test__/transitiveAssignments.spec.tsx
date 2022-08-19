import "./jest.extend";

describe("transitive assignments", () => {
  expect(`
    const count = 1;
    const double = count * 2;
    const Button = () => <Button onClick={() => count++} />
  `).toBeTransformedTo(`
    const [getCount, setCount] = rsjx.value(1);
    const [getDouble, setDouble] = rsjx.value(() => getCount() * 2);
    const Button = () => <Button onClick={() => setCount(getCount() + 1)} />
  `);

  expect(`
    const count = 1;
    const double = count * 2;
    const quad = double * 2;
    const Button = () => <Button onClick={() => count++} />
  `).toBeTransformedTo(`
    const [getCount, setCount] = rsjx.value(1);
    const [getDouble, setDouble] = rsjx.value(() => getCount() * 2);
    const [getQuad, setQuad] = rsjx.value(() => getCount() * 2);
    const Button = () => <Button onClick={() => setCount(getCount() + 1)} />
  `);
});
