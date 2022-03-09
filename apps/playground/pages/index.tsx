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

const initialSource = `let count = 0;

function handleClick() {
  count = count + 1;
}

const el = (
  <main>
    <h1>Count is {count} ({count % 2 === 0 ? "even" : "uneven"})</h1>
    <button onClick={handleClick}>inc count</button>
  </main>
);

document.getElementById("app").append(el);`;

const Home: NextPage<SsrProps> = ({ runtime }) => {
  return (
    <main className="h-screen">
      <Playground initialSource={initialSource} runtime={runtime} />
    </main>
  );
};

export default Home;
