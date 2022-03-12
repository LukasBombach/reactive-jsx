import { resolve } from "path";
import { promises as fs } from "fs";
import dynamic from "next/dynamic";

import type { NextPage, InferGetServerSidePropsType } from "next";

const Example = dynamic(() => import("components/Example"), { ssr: false });

const helloWorld = `
const el = <h1>Hello world</h1>;

document.body.append(el);`;

const variables = `
const name = 'Rick Astley';

const el = <h1>Hello {name}</h1>;

document.body.append(el);`;

const dynamicAttributes = `
const src = '/tutorial/image.gif';
const name = 'Rick Astley';

const el = <img src={src} alt={\`$\{name} dancing\`} />;

document.body.append(el);`;

const components = `
const Component = () => {
  const name = 'Rick Astley';

  return <h1>Hello {name}</h1>;
};

document.body.append(<Component />);`;

const nestedComponents = `
const Component = () => {
  return <h1>This component <br /> <Nested /></h1>;
};

const Nested = () => {
  return <em>nests this component</em>;
};

document.body.append(<Component />);`;

const reactiveAssignments = `
const Component = () => {
  let count = 0;

  function handleClick() {
    count = count + 1;
  }

  return (
    <button onClick={handleClick}>
      Clicked {count} {count === 1 ? 'time' : 'times'}
    </button>
  )
};

document.body.append(<Component />);`;

const reactiveAssignmentsInline = `
const Component = () => {
  let count = 0;

  return (
    <button onClick={() => count = count + 1}>
      Clicked {count} {count === 1 ? 'time' : 'times'}
    </button>
  )
};

document.body.append(<Component />);`;

const sharedContext = `
let count = 0;

const Display = () => <h1>Count is {count}</h1>;

const Increase = () => (
  <button onClick={() => count = count + 1}>
    Increase
  </button>
);

const Decrease = () => (
  <button onClick={() => count = count - 1}>
    Decrease
  </button>
);

document.body.append(<Display />, <Increase />, <Decrease />);`;

const Home: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ runtime }) => {
  return (
    <main className="container mx-auto">
      Hello World
      <Example source={helloWorld} runtime={runtime} />
      Variables
      <Example source={variables} runtime={runtime} />
      Dynamic Attributes
      <Example source={dynamicAttributes} runtime={runtime} className="h-[280px]" />
      Components
      <Example source={components} runtime={runtime} />
      Nested Components
      <Example source={nestedComponents} runtime={runtime} />
      Reactive Assignments
      <Example source={reactiveAssignments} runtime={runtime} />
      Inline Reactive Assignments
      <Example source={reactiveAssignmentsInline} runtime={runtime} />
      Shared Values (React Context)
      <Example source={sharedContext} runtime={runtime} />
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
