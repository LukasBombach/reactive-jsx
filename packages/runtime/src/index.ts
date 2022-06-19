import { createRuntime } from "./runtime";

const { value, react, log } = createRuntime();

console.clear();

const num = value(1, "num");
const double = value(0, "double");

react(() => double.set(2 * num.get()), "multiDbl");

react(() => {
  const str = `> 2 * ${num.get()} = ${double.get()}`;
  log(str);
  // document.body.insertAdjacentHTML("beforeend", `<pre>${str}</pre>`);
}, "print");

num.set(2);
num.set(3);
num.set(5);
num.set(1);
