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
          Like many others, I have also noticed that React has seemingly gotten more difficult than in the olden days
          [tm]. I belive this is because, when introduced, React shrunk down a notirously difficult problem—implementing
          user interfaces—to a managable model.
        </P>
        <P>
          If you ever hear a back end person say that front end is easy and back end is the real deal, describe that a
          user interface, in its most basic form, already is a real-time distributed system with multiple local and
          shared states, concurrency and parallelism. Not to mention that this system does not only have to work, it
          needs work in a presentable way, presentable to humans that is, which imposes further complexity on how you
          have to do state and error handling. You may not just have one part of the system idly wait for some other
          part of the system or log an error to Kibana and call it a day.
        </P>
        <P>
          React made this complexity simple. Simple of course is relative and a generally a bad choice of words in
          computer science, but it shrunk down the complexity of this and simplified this to a mental model (another
          worn-out term these days, I feel) that makes the hardness of UI managable. It promoted Components, State, and
          Props. These things together make up the building blocks that allows managing this distributed mess.
        </P>
        <ul>
          <li>Components xyz</li>
          <li>State xyz</li>
          <li>Props xyz</li>
        </ul>
        <P>
          The effectiveness of this model is proven by the evolutionary nature of computer science. Libraries die,
          Frameworks die, but good ideas survive. This basics model has been copied and adapted by the other giants of
          front end development. Svelte, Solid, Vue—they have their own twists and USPs, but they do have one idea in
          common, can you see it? There are other frameworks out there, some backed by large corporations, but they are
          not part of the cool gang in the high school drama that is our industry.
        </P>
        <P>
          Like in evolution, we might see other paradigms some day, some more fitting to what we want to do. Things are
          always in constant change. As a famous quote by Buckminister Fuller goes
        </P>
        <blockquote>
          You never change things by fighting the existing reality. To change something, build a new model that makes
          the existing model obsolete.
        </blockquote>
        <P>
          Conversely, a new model that&apos;s worse than the old model, will be unnoticed, ridiculed or creates
          resistance. In regards to React, something has changed.
        </P>
        <P>
          and I belive it is this: Generally speaking, before hooks, the React&apos;s mental model encompassed
          components.
        </P>

        <ul>
          <li>[no one size fits all]</li>
          <li>[crtiqe from that article: different kinds if abstractions für reactivitiy]</li>
          <li>
            [different asbstractions provide diferent mental models of how things work and what is happening behind the
            scenes. some provide benefits for DX at the cost of control and insight, others go the other way around]
          </li>
          <li>
            [just for fun (link to just for fun) and as a genuine and constructute contribution to explore the
            possiblities of abstractions]
          </li>
          <li>
            [let&apos;s try another extreme: abstracting it all away at compile time. no knowledge of a runtime
            required, a mental model of possbile states and maybe an &quot;it just works&quot; feeling]
          </li>
        </ul>
      </main>
    </Layout>
  );
}
