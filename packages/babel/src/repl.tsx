let count = 0;
let double = count * 2;
let quad = double * 2;

function inc() {
  inc2();
}

function inc2() {
  count++;
}

document.title = `title is ${count}`;

export const Button = () => (
  <button onMouseUp={inc}>
    {count} {double} {quad}
  </button>
);
