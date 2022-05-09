import { Playground } from "@reactive-jsx/playground";
import { Layout, BlogTitle, P, Code, PostCredit } from "components";

const initialExample = `
const Component = () => {
  let count = 0;

  return (
    <button onClick={() => count = count + 1}>
      Clicked {count}
    </button>
  )
};

document.body.append(<Component />);`;

const insteadOfReactContext = `
let count = 42;

const Button = () => (
  <button onClick={() => count = count + 1}>
    Clicked {count}
  </button>
);

const Result = () => <h1>The answer is {count}</h1>;

document.body.append(<Button />, <Result />);`;

export default function ExploringReactiveJsx() {
  return (
    <Layout>
      <PostCredit date={new Date("5/26/2022")} />
      <header>
        <BlogTitle>Exploring compile time reactive JSX</BlogTitle>
        <blockquote className="pl-3 border-l-2 sm:pl-3 sm:border-l-4 border-slate-200 text-slate-500 max-w-screen-sm">
          Writing simpler components by transpiling away the hard parts
        </blockquote>
      </header>
      <main>
        <P>What if you could write components like this?</P>
        <Playground className="my-6 max-w-screen-lg" source={initialExample} resolveFile={() => null} />
        <P>
          No <Code>setCount</Code>, no <Code>useEffect</Code>. You just define a variable and then change it. The
          component is updated accordingly.
        </P>
        <P>
          Well, you can, try it. You find <Code>Context</Code> annoying and a hassle to work with? So do I, why can't we
          just define a variable and use it in more than one component? You can!
        </P>
        <Playground className="max-w-screen-lg" source={insteadOfReactContext} resolveFile={() => null} />
      </main>
    </Layout>
  );
}
