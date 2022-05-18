import { Playground } from "@reactive-jsx/playground";
import { Layout, BlogTitle, P, Code, PostCredit } from "components";

const initialExample = `
const Component = () => {
  let count = 0;

  return (
    <button onClick={() => count = count + 1}>
      You clicked {count} {count === 1 ? 'time' : 'times'}
    </button>
  );
};

document.body.append(<Component />);`;

const useEffect = `
const Component = () => {
  let count = 0;

  document.title = \`You clicked \${count} \${count === 1 ? 'time' : 'times'}\`;

  return (
    <button onClick={() => count = count + 1}>
      You clicked {count} {count === 1 ? 'time' : 'times'}
    </button>
  );
};

document.body.append(<Component />);`;

const insteadOfReactContext = `
let count = 42;

const Button = () => <button onClick={() => count = count + 1}>Click me</button>;

const Result = () => <p>The answer is {count}</p>;

document.body.append(<Button />, <Result />);`;

const insteadOfReactContextExtreme = `
let count = 42;

function incCount() {
  count = count + 1;
}

const Button = () => <button onClick={incCount}>Click me</button>;

const Result = () => <p>The answer is {count}</p>;

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
        <P>
          <em className="pb-px border-b-[3px] border-b-sky-300">React is a very good libary</em>. It promotes a clean
          and simple mental model for writing user interfaces. With components we can define reusable chunks of our UI
          and orchestrate everything to a whole that is greater than the sum of its parts.
        </P>

        <P>
          At some point though, it gets less simple. Hooks and Context bloat code and less trivial examples of{" "}
          <Code>useEffect</Code> demand an understanding of reactive programming, deserting the simple model of
          components and life cycles.
        </P>

        <P>
          <span className="pb-px border-b-[3px] border-b-sky-300">Can we not write components like this?</span>
        </P>

        <Playground className="my-10 max-w-screen-sm" source={initialExample} />

        <P>
          No need for <Code>useState</Code> or <Code>setCode</Code>, all you need to do is declare a variable and change
          it. The DOM will update accordingly. That's good, right? It's easy. It's what you <em>want</em> it to do.
        </P>

        <P>
          This is, in fact, possible. By transpiling the{" "}
          <em className="pb-px border-b-[3px] border-b-sky-300">simple code that expresses your intention</em>, to more{" "}
          <em className="pb-px border-b-[3px] border-b-rose-300">verbose code that makes this happen</em>.
        </P>

        <P className="flex justify-center space-x-4 pt-12 pb">
          <div className="w-1 h-1 rounded-full bg-slate-300"></div>
          <div className="w-1 h-1 rounded-full bg-slate-300"></div>
          <div className="w-1 h-1 rounded-full bg-slate-300"></div>
        </P>

        <P className="font-semibold text-center pt-12">
          Try it out, these are all functional &amp; editable playgrounds.
        </P>

        <P className="flex justify-center space-x-4 pt-12 pb-4">
          <div className="w-1 h-1 rounded-full bg-slate-300"></div>
          <div className="w-1 h-1 rounded-full bg-slate-300"></div>
          <div className="w-1 h-1 rounded-full bg-slate-300"></div>
        </P>

        <h2 className="font-bold text-2xl pt-8 pb-3 max-w-screen-sm">How it works</h2>

        <P>Explanation with images</P>

        <h2 className="font-bold text-2xl pt-8 pb-3 max-w-screen-sm">Things you can do</h2>

        <h3 className="font-bold text-md pt-8 pb-3 max-w-screen-sm">
          Side Effects aka <Code>useEffect</Code>
        </h3>

        <P>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil veritatis quis ab iste pariatur quibusdam.
          Deserunt ex laudantium quam voluptates.
        </P>

        <Playground className="my-10 max-w-screen-sm" source={useEffect} />

        <h3 className="font-bold text-md pt-8 pb-3 max-w-screen-sm">Context</h3>

        <P>
          In regards to data, <Code>Context</Code> can become specifically cumbersome. In my mind, <Code>Context</Code>{" "}
          is just a a piece of data, shared across multiple components. It should be as easy as that.
        </P>

        <Playground className="my-10 max-w-screen-sm" source={insteadOfReactContext} />

        <P>
          You can even go further and put the functionality to increase the counter <em>where you like</em>. You don't
          have to follow the requirements of the framework, but are free to decide the structure of your code.
        </P>

        <Playground className="my-10 max-w-screen-sm" source={insteadOfReactContextExtreme} />

        <h2 className="font-bold text-2xl pt-8 pb-3 max-w-screen-sm">Why</h2>

        <P>
          The motivation behind this, is that code should be readable and comprehensible. By this, I mean that it
          communicates what it is supposed to do in simple terms and with little noise from helper code.
        </P>

        <P>
          It will reveal more clearly how it works to our colleagues and our future selves. It helps us to get to our
          goals faster and make less mistakes.
        </P>

        <P>
          I have yet to see someone express this notion as eloquently as the author of Svelte, Rich Harris, in his talk{" "}
          <a href="https://www.youtube.com/watch?v=BzX4aTRPzno" className="text-sky-700 hover:text-sky-500">
            "Write Less, Do More" at the JSCAMP 2019
          </a>
          . And of course a big chunk of the infamous Book "Clean Code" by Uncle Bob explores this idea in detail.
        </P>

        <h3 className="font-bold text-md pt-8 pb-3 max-w-screen-sm">
          <em className="pb-px border-b-[3px] border-b-sky-300">A hammer</em>, not an{" "}
          <em className="pb-px border-b-[3px] border-b-rose-300">"insert-nail-here-machine"</em>
        </h3>

        <P>By XXX reactive JSX does not have to put enables yyy instead of constrains zzz</P>

        {/* <h2 className="font-bold text-2xl pt-8 pb-3 max-w-screen-sm">How</h2> */}

        {/* <Playground className="my-10 max-w-screen-sm" source={""} /> */}

        {/* <h2 className="font-bold text-2xl pt-6 pb-3 max-w-screen-sm">Every abstraction introduces problems</h2>

        <P>
          While Svelte is a <em>good framework</em>, it comes with batteries included, an extra battery pack and a
          docking station for all your needs. This is a matter of liking and use-case, but I am not a fan of template
          languages, <em>personally</em>. Am I willing to go as far as <Code>JSX</Code>, but Svelte deviates from
          standard ecma script too much <em>for my liking</em>.
        </P>

        <P>Reactive JSX works event without Componets, it just returns DOM elements (example withuot compoenents)</P> */}
      </main>
    </Layout>
  );
}
