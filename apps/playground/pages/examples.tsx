import { resolve } from "path";
import { promises as fs } from "fs";
import dynamic from "next/dynamic";

import type { NextPage, InferGetServerSidePropsType } from "next";

const Example = dynamic(() => import("components/Example"), { ssr: false });

const helloWorld = `
const name = 'world';

const el = <h1>Hello {name}</h1>;

const root = document.getElementById("app");
root.append(el);`;

const dynamicAttributes = `
const src = '/tutorial/image.gif';
const name = 'Rick Astley';

const el = <img src={src} alt={\`$\{name} dancing\`} />;

const root = document.getElementById("app");
root.append(el);`;

const components = `
const Component = () => {
  const name = 'world';

  return <h1>Hello {name}</h1>;
};

const root = document.getElementById("app");
root.append(<Component />);`;

const nestedComponents = `
const Nested = () => {
  return <em>nests this component</em>;
};

const Component = () => {
  return <h1>This component <Nested /></h1>;
};

const root = document.getElementById("app");
root.append(<Component />);`;

const reactiveAssignments = `
let count = 0;

function handleClick() {
  count += 1;
}

const el = (
  <button onClick={handleClick}>
    Clicked {count} {count === 1 ? 'time' : 'times'}
  </button>
)

const root = document.getElementById("app");
root.append(el);`;

const Home: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ runtime }) => {
  return (
    <main className="container mx-auto">
      Hello World
      <Example source={helloWorld} runtime={runtime} />
      Dynamic Attributes
      <Example source={dynamicAttributes} runtime={runtime} className="h-[280px]" />
      Components
      <Example source={components} runtime={runtime} />
      Nested Components
      <Example source={nestedComponents} runtime={runtime} />
      Reactive Assignments
      <Example source={reactiveAssignments} runtime={runtime} />
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
