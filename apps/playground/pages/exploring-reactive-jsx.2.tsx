import Image from "next/image";
import { Playground } from "@reactive-jsx/playground";
import { Layout, BlogTitle, P, Code, PostCredit } from "components";

import type { FC, ReactNode } from "react";

const teaserCode = `
const Button = () => {
  let count = 1;

  return (
    <button onClick={() => count++}>
      Count is {count}
    </button>
  );
};

rjsx.render(<Button />, document.body);`;

const context = `
let count = 1;

const Dec = () => <button onClick={() => count--}> - </button>;
const Inc = () => <button onClick={() => count++}> + </button>;
const Show = () => <p> Count is {count} </p>;

const App = () => (
  <div>
    <Show />
    <Dec />
    <Inc />
  </div>
);

rjsx.render(<App />, document.body);`;

const effect = `
const Button = () => {
  let count = 1;

  console.log(\`Count is \${count}\`);

  return <button onClick={() => count++}>Click</button>;
};

rjsx.render(<Button />, document.body);`;

const Highlight: FC<{ color?: "amber" | "emerald" | "sky"; children?: ReactNode }> = ({
  color = "amber",
  children,
}) => {
  const border = {
    amber: "border-b-amber-400",
    emerald: "border-b-green-500",
    sky: "border-b-sky-300",
  }[color];
  return <span className={`pb-px border-b-[3px] ${border}`}>{children}</span>;
};

export default function ExploringReactiveJsx() {
  return (
    <Layout>
      <PostCredit date={new Date("8/27/2022")} />
      <header>
        <BlogTitle>Exploring compile time reactive JSX</BlogTitle>
        <blockquote className="pl-3 border-l-2 sm:pl-3 sm:border-l-4 border-slate-200 text-slate-500 max-w-screen-sm">
          Writing simpler components by transpiling away the hard parts
        </blockquote>
      </header>
      <main>
        <P>
          <Highlight>Front end development is hard.</Highlight> Sometimes, a statement like this would get
          ridiculed—&quot;back end is much more complex&quot;, they would say. But think about the inherent complexity
          of implementing a user interface. In its basic form, it is a distributed system of independent actors that
          runs on parallelism and concurrency. You need to manage state—at scale—and take care of the details as well.
        </P>
        <P>
          Luckily, a lot of this mess can be managed through reactive UI frameworks, with React as their benevolent
          ruler. But React is not without criticism. While writing components and using <Code>useState</Code> feels
          pretty straight forward, things begin to feel less <em>straight forward</em> once you have to{" "}
          <Code>useEffect</Code> or <Code>useContext</Code>.
          {/*  Why do we have to use hooks though?{" "}
          <Highlight>Can we not just do this?</Highlight> */}
        </P>

        <P>
          I googled &quot;useEffect&quot; and found{" "}
          <a href="https://dmitripavlutin.com/react-useeffect-explanation/" className="text-blue-600 hover:underline">
            A Simple Explanation of React.useEffect()
          </a>
          . That does not seem simple to me.
          <Image
            src="/exploring-reactive-jsx/a_simple_explanation_of_useeffect.svg"
            alt="diagram explaining how useEffect works"
            layout="fill"
          />
          And then there is callback hell.
        </P>

        <Playground className="my-10 max-w-screen-sm" source={teaserCode} />

        <P>
          Conceptually speaking, in React <Highlight>state is merely a mutable variable</Highlight> that gets updated.
          Should it not be as simple as that? Especially context starts to impose the structure of the framework on you.
          Have you ever heard the term context hell? Well,{" "}
          <Highlight>context is just a variable that is shared between components</Highlight>, so why can&apos;t the
          code <em>just be that</em>?
        </P>

        <Playground className="my-10 max-w-screen-sm" source={context} />

        <P>
          And finally, <Highlight>an effect is just a statement that contains a variable</Highlight>.
        </P>

        <Playground className="my-10 max-w-screen-sm" source={effect} />

        <P>
          <Highlight color="emerald">
            It actually works, all of these examples are fully functional playgrounds
          </Highlight>
          . Feel free to try them out!
        </P>

        <P>These examples may seem trivial, but there is a reason why this is good.</P>
      </main>
    </Layout>
  );
}
