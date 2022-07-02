import { value, react } from ".";

console.clear();

const num = value(1, "num");
const double = value(() => num.get() * 2, "double");

react(() => console.log(`\n> ${num.get()} * 2 = ${double.get()}`), "print");

num.set(4);
num.set(num.get() * 10);
