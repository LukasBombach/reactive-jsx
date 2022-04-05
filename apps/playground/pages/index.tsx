import { resolve } from "path";
import { promises as fs } from "fs";
import dynamic from "next/dynamic";

import type { NextPage, InferGetServerSidePropsType } from "next";

type SsrProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const Playground = dynamic(() => import("components/Playground"), { ssr: false });

export const getServerSideProps = async (): Promise<{ props: { runtime: string } }> => {
  const runtimePath = resolve(process.cwd(), "../../packages/runtime/dist/index.modern.js");
  const runtime = await fs.readFile(runtimePath, "utf-8");

  return {
    props: {
      runtime,
    },
  };
};

const source1 = `
let count = 0;

const Display = () => <h1>Count is {count}</h1>;

const Increase = () => (
  <button onClick={() => count += 1}>
    Increase
  </button>
);

const Decrease = () => (
  <button onClick={() => count -= 1}>
    Decrease
  </button>
);

document.body.append(<Display />, <Increase />, <Decrease />);`;

const source2 = `
let count = 0;

const Component = () => {
  return (
    <button onClick={() => count = count + 1}>
      Clicked {count} {count === 1 ? 'time' : 'times'}
    </button>
  )
};

document.body.append(<Component />);`;

const Home: NextPage<SsrProps> = ({ runtime }) => {
  return (
    <main className="h-screen">
      <Playground initialSource={source1} runtime={runtime} />
    </main>
  );
};

export default Home;
