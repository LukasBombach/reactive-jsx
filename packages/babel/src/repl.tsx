let count = 0;

function inc() {
  count++;
}

document.title = `title is ${count}`;

export const Button = () => <button onClick={inc}>{count}</button>;
