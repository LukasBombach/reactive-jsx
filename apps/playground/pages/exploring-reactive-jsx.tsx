import { Playground } from "@reactive-jsx/playground";
import { Layout, BlogTitle, P, Code, PostCredit } from "components";
import { Head } from "next/document";

const initialExample = `
const Component = () => {
  let count = 0;

  return (
    <button onClick={() => count = count + 1}>
      Clicked {count} {count === 1 ? "time" : "times"}
    </button>
  )
};

document.body.append(<Component />);`;

const insteadOfReactContext = `
let count = 42;

const Button = () => <button onClick={() => count = count + 1}>Click</button>;

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
        <Playground className="my-8 max-w-screen-lg" source={initialExample} />
        <P>
          No need for <Code>useState</Code> or <Code>setCode</Code>, all you need to do is declare a variable and change
          it. The DOM will update accordingly. That's good, right? It's easy. It's straight forward.
        </P>
        {/* <P>
          <blockquote className="twitter-tweet" data-lang="en" data-dnt="true">
            <p lang="en" dir="ltr">
              i am in hell <a href="https://t.co/dbIMp3mN87">pic.twitter.com/dbIMp3mN87</a>
            </p>
            &mdash; keith@cute.is 🐘 (@keithkurson){" "}
            <a href="https://twitter.com/keithkurson/status/1511779108090363904?ref_src=twsrc%5Etfw">April 6, 2022</a>
          </blockquote>
          <Head>
            <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8" />
          </Head>
        </P> */}
        {/* <P>
          No <Code>setCount</Code>, no <Code>useEffect</Code>. You just define a variable and then change it. The
          component is updated accordingly.
        </P> */}
        <P>
          {/* Well, you can—try it. You find <Code>Context</Code> annoying and a hassle to work with? So do I, why can't we
          just define a variable and use it in more than one component? You can! */}
          <Code>Context</Code> can become cumbersome. In my mind, what I am doing with <Code>Context</Code>, is
          declaring a variable and sharing it across multiple components. It should be as easy as that.
        </P>
        <Playground className="my-8 max-w-screen-lg" source={insteadOfReactContext} />
        <P>
          It is possible to do this. By transpiling the{" "}
          <em className="pb-px border-b-[3px] border-b-sky-300">simple code that expresses your intention</em>, to more{" "}
          <em className="pb-px border-b-[3px] border-b-rose-300">verbose code that makes this happen</em>.
        </P>
        <P>
          The intention behind this, is that code should be readable. By readable, I mean that it communicates what it
          is supposed to do in simple terms and with little noise from helper code.
        </P>
        <P>
          I have yet to see someone express this as eloquently as the author of Svelte, Rich Harris, in his talk{" "}
          <a href="https://www.youtube.com/watch?v=BzX4aTRPzno" className="text-sky-600">
            <em>Write Less, Do More</em> at the JSCAMP 2019
          </a>
          . And of course a big chunk of the infamous Book "Clean Code" by Uncle Bob explores this idea in detail.
        </P>
        <h2 className="font-bold text-2xl pt-6 pb-3 max-w-screen-sm">Every abstraction introduces problems</h2>
        <P>
          While Svelte is a <em>good framework</em>, it comes with batteries included, an extra battery pack and a
          docking station for all your needs. This is a matter of liking and use-case, but I am not a fan of themplate
          languages, <em>personally</em>. Am I willing to go as far as <Code>JSX</Code>, but Svelte deviates from
          standard ecma too much <em>for my liking</em>.
        </P>
        <P>Reactive JSX works event without Componets, it just returns DOM elements (example withuot compoenents)</P>
      </main>
    </Layout>
  );
}
