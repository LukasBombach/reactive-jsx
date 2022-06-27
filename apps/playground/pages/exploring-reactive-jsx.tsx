import { Playground } from "@reactive-jsx/playground";
import { Layout, BlogTitle, P, Code, PostCredit } from "components";

// let tripled = count * 3, twelved = tripled * 4;

const dev = `
const Component = () => {
  let count = 1;

  let double = count * 2;
  let quad;
  quad = count * 4;

  return <button onClick={() => count++}>{count} * 2 = {double} * 2 = {quad}</button>
};


document.body.append(<Component />);`;

/* const dev = `
const Component = () => {
  let count = 1;

  let tripled = count * 3;

  let quadrupled;
  quadrupled = count * 4;

  return <button onClick={() => count++}>{count} * 3 = {tripled}, {count} * 4 = {quadrupled}</button>
};

document.body.append(<Component />);`; */

/* const dev = `
const Component = () => {
  let count = 1;

  let doubled = count * 2;
  let quadrupled = doubled * 2;

  let tripled;

  tripled = count * 3;

  return (<div>
      <button onClick={() => count++}>
        Count: {count}
      </button>

      
      <p>{count} * 2 = {doubled}</p>
      <p>{doubled} * 2 = {quadrupled}</p>

      <p>{count} * 3 = {tripled}</p>
    </div>
  );
};

document.body.append(<Component />);`; */

const initialExample = `
const Component = () => {
  let count = 0;

  return (
    <button onClick={() => count++}>
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
    <button onClick={() => count++}>
      You clicked {count} {count === 1 ? 'time' : 'times'}
    </button>
  );
};

document.body.append(<Component />);`;

const insteadOfReactContext = `
let count = 42;

const Button = () => <button onClick={() => count++}>Click me</button>;

const Result = () => <p>The answer is {count}</p>;

document.body.append(<Button />, <Result />);`;

const insteadOfReactContextExtreme = `
let count = 42;

function incCount() {
  count++;
}

const Button = () => <button onClick={incCount}>Click me</button>;

const Result = () => <p>The answer is {count}</p>;

document.body.append(<Button />, <Result />);`;

//

export default function ExploringReactiveJsx() {
  if (false) {
    return (
      <Layout>
        <PostCredit date={new Date("5/26/2022")} />
        <Playground source={dev} />
      </Layout>
    );
  }

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
          it. The DOM will update accordingly. That&apos;s good, right? It&apos;s easy. It&apos;s what you <em>want</em>{" "}
          it to do.
        </P>

        <P>
          This is, in fact, possible. By transpiling the{" "}
          <em className="pb-px border-b-[3px] border-b-sky-300">simple code that expresses your intention</em>, to more{" "}
          <em className="pb-px border-b-[3px] border-b-rose-300">verbose code that makes this happen</em>.
        </P>

        <P className="flex justify-center space-x-4 pt-12 pb">
          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
        </P>

        <P className="font-semibold text-center pt-12">
          Try it out, these are all functional &amp; editable playgrounds.
        </P>

        <P className="flex justify-center space-x-4 pt-12 pb-4">
          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
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
          You can even go further and put the functionality to increase the counter <em>where you like</em>. You
          don&apos;t have to follow the requirements of the framework, but are free to decide the structure of your
          code.
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
            &quot;Write Less, Do More&quot; at the JSCAMP 2019
          </a>
          . And of course a big chunk of the infamous Book &quot;Clean Code&quot; by Uncle Bob explores this idea in
          detail.
        </P>

        <h3 className="font-bold text-md pt-8 pb-3 max-w-screen-sm">
          <em className="pb-px border-b-[3px] border-b-sky-300">A hammer</em>, not an{" "}
          <em className="pb-px border-b-[3px] border-b-rose-300">&quot;insert-nail-here-machine&quot;</em>
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
        <h4>Further explorations</h4>

        <ul>
          <li>ssr tree shaking</li>
          <li>million js</li>
        </ul>

        <h4>notes</h4>

        <p>check out the dev tools, the only things that get updated are text fragments, not event the enire text</p>
        <p>also, here is the callstack for the updates, no more work is done than the almost-vanilla js itself!</p>
      </main>
    </Layout>
  );
}
