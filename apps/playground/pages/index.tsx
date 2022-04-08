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
const Component = () => {
  let count = 0;
  let text = "";  
  
  if (count %2 === 0) {
    text = "Count is even";
  } else {
    text = "Count is odd";
  }

  return (
    <button onClick={() => count = count + 1}>
    {text} ({count})
    </button>
  )
};

document.body.append(<Component />);`;

const source2 = `

const Component = () => {
  let count = 0;

  return (
    <button onClick={() => count = count + 1}>
      Clicked {count} {count === 1 ? 'time' : 'times'}
    </button>
  )
};

document.body.append(<Component />);`;

const source3 = `
const Component = () => {
  let count = 0;
  
  function handleMouseDown() {
  	count--;
  }

  return (
    <button onMouseDown={handleMouseDown} onMouseUp={() => count++} onHover={function () {}}>
      {count}
    </button>
  )
};

document.body.append(<Component />);
`;

const Home: NextPage<SsrProps> = ({ runtime }) => {
  return (
    <main className="h-screen">
      <Playground initialSource={source3} runtime={runtime} />
    </main>
  );
};

export default Home;
