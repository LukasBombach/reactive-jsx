import { createRuntime } from "./runtime";

const { value, react } = createRuntime();

console.clear();

const num = value(1, "num");
const double = value(0, "double");

react(() => double.set(num.get() * 2), "multi_double");

react(() => console.log(`\n> ${num.get()} * 2 = ${double.get()}\n`), "print");

num.set(2);
