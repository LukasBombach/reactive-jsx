import type { NextPage } from "next";

// todo maybe allow T to be Read<T> and return another Read<T>
type Read<T> = () => T;
type Write<T> = (value: T) => void;

// type Value<T> = Read<T> & Write<T>;
// type Reaction<T, R extends T | void> = (fn: (value: T) => R) => Read<R>;
// const currentReaction = new Set<Value<unknown>>();
// type Subscribers = { subscribers: Set<unknown> };

type Reaction<T> = (value: T) => T;

let currentReacton: Reaction<any> | null = null;

// todo cleanup
function value<T>(initial: T): Read<T> & Write<T> {
  let current = initial;
  const subscribers = new Set<Reaction<any>>();
  return (next?: T) => {
    if (next) {
      current = next;
      subscribers.forEach(fn => fn(current));
    } else {
      if (currentReacton) {
        subscribers.add(currentReacton);
      }
      return current;
    }
  };
}

function reaction<T, R = T | void>(fn: Reaction<R>): Read<R> {
  currentReacton = fn;
  let current = fn(null);
  currentReacton = null;
  return () => {
    currentReacton = fn;
    current = fn(current);
    currentReacton = null;
    return current;
  };
}

const num = value(2);
const double = reaction(() => num() * 2);

reaction(() => console.log("num", num()));
reaction(() => console.log("double", double()));

num(4);
num(6);

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
