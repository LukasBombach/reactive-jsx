import { createRuntime } from "./runtime";

const { value, react } = createRuntime();

console.clear();

const num = value(1, "num");
// const double = value(() => num.get() * 2, "double");
const double = value(0, "double");
double.set(() => num.get() * 2);

react(() => console.log(`\n> ${num.get()} * 2 = ${double.get()}\n`), "print");

// num.set(() => num.get() + 1);
num.set(() => 2);
