# Requirements

## event handlers

### Mutation in event handler

- `count` must be reactive

```tsx
const Button = () => {
  let count = 0;
  return <button onClick={() => count++}>{count}</button>;
};
```

- must follow identifier of function

```tsx
const Button = () => {
  let count = 0;

  const handleClick = () => count++;

  return <button onClick={handleClick}>{count}</button>;
};
```

- must follow calls inside function

```tsx
const Button = () => {
  let count = 0;

  const handleClick = () => inc();
  const inc = () => count++;

  return <button onClick={handleClick}>{count}</button>;
};
```

## derived values

- `count` must be reactive

```tsx
const Button = () => {
  let count = 0;
  return <button onClick={() => count++}>{count}</button>;
};
```

- `double` must be reactive

```tsx
const Button = () => {
  let count = 0;
  let double = count * 2; // let double; double = count * 2;
  return <button onClick={() => count++}>{double}</button>;
};
```

- `double` and `quad` must be reactive

```tsx
const Button = () => {
  let count = 0;
  let double = count * 2;
  let quad = double * 2;
  return <button onClick={() => count++}>{quad}</button>;
};
```

## statements

- `count` must be reactive

```tsx
const Button = () => {
  let count = 0;
  return <button onClick={() => count++}>{count}</button>;
};
```

- assignment of `document.title` must be reactive

```tsx
const Button = () => {
  let count = 0;
  document.title = `Count is ${count}`;
  return <button onClick={() => count++}>{count}</button>;
};
```

- `if` statement with `else` block must be reactive

```tsx
const Button = () => {
  let count = 0;
  let text = "Count is even";

  if (count % 2 === 0) {
    text = "Count is even";
  } else {
    text = "Count is odd";
  }

  return <button onClick={() => count++}>{text}</button>;
};
```

- `for` statement must be reactive

```tsx
const Button = () => {
  let count = 0;

  for (let i = 0; i < count; i++) {
    console.log(`Log #${i}`);
  }

  return <button onClick={() => count++} />;
};
```

# Implementation

```

const mutatedVariables =

for (fn in eventHandlers) {
  getMutatedVaribles
}



```
