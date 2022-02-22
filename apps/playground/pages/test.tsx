import type { NextPage } from "next";

// todo maybe allow T to be Read<T> and return another Read<T>
type Read<T> = () => T;
type Write<T> = (value: T) => void;

type Value<T> = Read<T> & Write<T>;
type Reaction<T, R extends T | void> = (fn: (value: T) => R) => Read<R>;

function value<T>(initial: T): Read<T> & Write<T> {
  let current = initial;
  return (next?: T) => {
    if (next) {
      current = next;
    } else {
      return current;
    }
  };
}

function reaction<T, R = T | void>(fn: (value: R) => R): Read<R> {
  let current = fn(null);
  return () => {
    current = fn(current);
    return current;
  };
}

const num = value(2);
reaction(() => console.log("num", num()));
num(4);

// const double = reaction(() => num() * 2);
// reaction(() => console.log("double", double()));
// num(4);

// setInterval(() => {
//   num(num() + 1);
// }, 1000);

const Home: NextPage = () => {
  return <main className="h-screen w-full bg-[#282c34]">hello</main>;
};

export default Home;

/* type Value<T> = {
  (): T;
  (next: T): void;
};

function value<T>(initial: T): Value<T> {
  let current = initial;
  return (next?: T) => {
    if (next) {
      current = next;
    } else {
      return current;
    }
  };
}

function reaction<T, R extends T | void>(fn: (current: T) => R): R {
  return fn();
}

const state = new Set(); */
