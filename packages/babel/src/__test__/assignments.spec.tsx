import "./jest.extend";

describe("assignments", () => {
  expect(`
    const count = 1;
    const Button = () => <Button onClick={() => count = count + 1} />
  `).toBeTransformedTo(`
    const [getCount, setCount] = rsjx.value(1);
    const Button = () => <Button onClick={() => setCount(getCount() + 1)} />
  `);

  expect(`
    const count = 5;
    const Button = () => <Button onClick={() => count = count + 23} />
  `).toBeTransformedTo(`
    const [getCount, setCount] = rsjx.value(5);
    const Button = () => <Button onClick={() => setCount(getCount() + 23)} />
  `);

  expect(`
    const count = 1;
    const Button = () => <Button onClick={() => count += 1} />
  `).toBeTransformedTo(`
    const [getCount, setCount] = rsjx.value(1);
    const Button = () => <Button onClick={() => setCount(getCount() + 1)} />
  `);

  expect(`
    const count = 5;
    const Button = () => <Button onClick={() => count += 23} />
  `).toBeTransformedTo(`
    const [getCount, setCount] = rsjx.value(5);
    const Button = () => <Button onClick={() => setCount(getCount() + 23)} />
  `);

  expect(`
    const count = 1;
    const Button = () => <Button onClick={() => count++} />
  `).toBeTransformedTo(`
    const [getCount, setCount] = rsjx.value(1);
    const Button = () => <Button onClick={() => setCount(getCount() + 1)} />
  `);

  expect(`
    const count = 1;
    const Button = () => <Button onClick={() => count = count - 1} />
  `).toBeTransformedTo(`
    const [getCount, setCount] = rsjx.value(1);
    const Button = () => <Button onClick={() => setCount(getCount() - 1)} />
  `);

  expect(`
    const count = 5;
    const Button = () => <Button onClick={() => count = count - 23} />
  `).toBeTransformedTo(`
    const [getCount, setCount] = rsjx.value(5);
    const Button = () => <Button onClick={() => setCount(getCount() - 23)} />
  `);

  expect(`
    const count = 1;
    const Button = () => <Button onClick={() => count -= 1} />
  `).toBeTransformedTo(`
    const [getCount, setCount] = rsjx.value(1);
    const Button = () => <Button onClick={() => setCount(getCount() - 1)} />
  `);

  expect(`
    const count = 5;
    const Button = () => <Button onClick={() => count -= 23} />
  `).toBeTransformedTo(`
    const [getCount, setCount] = rsjx.value(5);
    const Button = () => <Button onClick={() => setCount(getCount() - 23)} />
  `);

  expect(`
    const count = 1;
    const Button = () => <Button onClick={() => count--} />
  `).toBeTransformedTo(`
    const [getCount, setCount] = rsjx.value(1);
    const Button = () => <Button onClick={() => setCount(getCount() - 1)} />
  `);
});
