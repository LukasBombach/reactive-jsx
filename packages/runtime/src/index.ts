import { createRuntime } from "./runtime";

const { value, react } = createRuntime();

console.clear();

const num = value(1, "num");
const double = value(0, "double");

react(() => double.set(num.get() * 2), "setDouble");

react(() => console.log(`\n> ${num.get()} * 2 = ${double.get()}`), "print");

num.set(num.get() * 10);
