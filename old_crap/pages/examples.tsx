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

const reactiveStatements = `
const Component = () => {
  let count = 0;

  if (count >= 10) {
    alert("count is dangerously high!");
    count = 9;
  }

  return (
    <button onClick={() => count += 1}>
    Clicked {count} {count === 1 ? 'time' : 'times'}
    </button>
  )
};

document.body.append(<Component />);`;

const reactiveStatements2 = `
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
    Clicked {count}
    </button>
  )
};

document.body.append(<Component />);`;

const sharedContext = `
let count = 0;

const Display = () => <h1>Count is {count}</h1>;

const Decrease = () => (
  <button onClick={() => count = count - 1}>
    Decrease
  </button>
);

const Increase = () => (
  <button onClick={() => count = count + 1}>
    Increase
  </button>
);

document.body.append(<Display />, <Decrease />, <Increase />);`;

const Home: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ runtime }) => {
  return (
    <main className="container mx-auto">
      <section>
        <p>Hello World</p>
        <Example source={helloWorld} runtime={runtime} />
      </section>

      <section>
        <p>Variables</p>
        <Example source={variables} runtime={runtime} />
      </section>

      <section>
        <p>Dynamic Attributes</p>
        <Example source={dynamicAttributes} runtime={runtime} className="h-[280px]" />
      </section>

      <section>
        <p>Components</p>
        <Example source={components} runtime={runtime} />
      </section>

      <section>
        <p>Nested Components</p>
        <Example source={nestedComponents} runtime={runtime} />
      </section>

      <section>
        <p>Reactive Assignments</p>
        <Example source={reactiveAssignments} runtime={runtime} />
      </section>

      <section>
        <p>Inline Reactive Assignments</p>
        <Example source={reactiveAssignmentsInline} runtime={runtime} />
      </section>

      <section>
        <p>Reactive Statements</p>
        <Example source={reactiveStatements} runtime={runtime} />
      </section>

      <section>
        <p>Shared Values (React Context)</p>
        <Example source={sharedContext} runtime={runtime} />
      </section>
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
