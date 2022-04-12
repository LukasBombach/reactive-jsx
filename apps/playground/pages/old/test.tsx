import type { NextPage } from "next";

type Read<T> = () => T;
type Write<T> = (value: T) => void;

type Reaction<T> = (value: T) => T;

let currentReacton: Reaction<any> | null = null;

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
