import { resolve } from "path";
import { promises as fs } from "fs";
import dynamic from "next/dynamic";

import type { NextPage, InferGetServerSidePropsType } from "next";

const Example = dynamic(() => import("components/Example"), { ssr: false });

const helloWorld = `
const name = 'world';

const el = <h1>Hello {name}!</h1>

const root = document.getElementById("app");
root.append(el);`;

const dynamicAttributes = `
const src = '/tutorial/image.gif';
const name = 'Rick Astley';

const el = <img src={src} alt={\`$\{name} dancing\`} />

const root = document.getElementById("app");
root.append(el);`;

const Home: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ runtime }) => {
  return (
    <main className="container mx-auto">
      Hello World
      <Example source={helloWorld} runtime={runtime} />
      Dynamic Attributes
      <Example source={dynamicAttributes} runtime={runtime} className="h-[280px]" />
    </main>
  );
};

export const getServerSideProps = async (): Promise<{ props: { runtime: string } }> => {
  const runtimePath = resolve(process.cwd(), "../../packages/runtime/dist/index.modern.js");
  const runtime = await fs.readFile(runtimePath, "utf-8");

  return {
    props: {
      runtime,
    },
  };
};

export default Home;
