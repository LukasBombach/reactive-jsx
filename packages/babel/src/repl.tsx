let count = 0;
let double = count * 2;

document.title = `title is ${count}`;

if (count === 1) {
  console.log(`count is ${count}`);
}

for (let i = 0; i < 10; i++) {
  console.log(`loop ${count}`);
}

export const Button = () => <button onMouseUp={() => count++} />;
