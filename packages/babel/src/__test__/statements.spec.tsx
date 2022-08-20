import "./jest.extend";

describe("transitive assignments", () => {
  expect(`
    const count = 1;
    if (count > 2) alert("count is higher than two");
    const Button = () => <Button onClick={() => count++} />
  `).toBeTransformedTo(`
    const [getCount, setCount] = rjsx.value(1);
    rjsx.react(() => {
      if (getCount() > 2) alert("count is higher than two");
    })
    const Button = () => <Button onClick={() => setCount(getCount() + 1)} />
  `);

  expect(`
  const count = 1;
  if (unknownCondition()) alert(\`\${count} is higher than two\`);
  const Button = () => <Button onClick={() => count++} />
`).toBeTransformedTo(`
  const [getCount, setCount] = rjsx.value(1);
  rjsx.react(() => {
    if (unknownCondition()) alert(\`\${getCount()} is higher than two\`);
  })
  const Button = () => <Button onClick={() => setCount(getCount() + 1)} />
`);

  expect(`
    const count = 1;
    let i = 0;
    while (count > 2) alert("count is higher than two");
    const Button = () => <Button onClick={() => count++} />
  `).toBeTransformedTo(`
    const [getCount, setCount] = rjsx.value(1);
    rjsx.react(() => {
      if (getCount() > 2) alert("count is higher than two");
    })
    const Button = () => <Button onClick={() => setCount(getCount() + 1)} />
  `);
});
