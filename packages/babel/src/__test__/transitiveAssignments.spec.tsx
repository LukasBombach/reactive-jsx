import "./jest.extend";

describe("transitive assignments", () => {
  expect(`
    const count = 1;
    const double = count * 2;
    const Button = () => <Button onClick={() => count++} />
  `).toBeTransformedTo(`
    const [getCount, setCount] = rjsx.value(1);
    const [getDouble, setDouble] = rjsx.value(() => getCount() * 2);
    const Button = () => <Button onClick={() => setCount(getCount() + 1)} />
  `);

  expect(`
    const count = 1;
    const double = count * 2;
    const quad = double * 2;
    const Button = () => <Button onClick={() => count++} />
  `).toBeTransformedTo(`
    const [getCount, setCount] = rjsx.value(1);
    const [getDouble, setDouble] = rjsx.value(() => getCount() * 2);
    const [getQuad, setQuad] = rjsx.value(() => getCount() * 2);
    const Button = () => <Button onClick={() => setCount(getCount() + 1)} />
  `);
});
