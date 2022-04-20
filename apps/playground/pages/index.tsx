import { Playground } from "@reactive-jsx/playground";

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

const Result = () => <h1>The answer is {count}</h1>;

const Button = () => (
  <button onClick={() => count = count + 1}>
    Clicked {count}
  </button>
);

document.body.append(<Button />, <Result />);`;

export default function Home() {
  return (
    <main className="container mx-auto grid gap-6 py-8">
      <h1 className="font-bold leading-tight text-5xl">
        React meet Svelte meet Solid:
        <br />
        Reactive JSX
      </h1>
      <blockquote className="pl-3 border-l-4 border-slate-200 text-sm text-slate-400">
        Note: When this shows up in the git history, this text will be super emberrassing. I am writing this text only
        to find a narrative which I can write code examples for. This way I can find an idea which features to
        implement.
      </blockquote>
      {/* <p>What if you could write react components like this?</p>
      <Playground source={initialExample} resolveFile={() => null} />
      <p>
        No <code>setCount</code>, no <code>useEffect</code>. You just define a variable and then change it. The
        component is updated accordingly.
      </p> 
      <p>
        Well, you can, try it. You find <code>Context</code> annoying and a hassle to work with? So do I, why can't we
        just define a variable and use it in more than one component? You can!
      </p>
      */}
      <Playground source={insteadOfReactContext} resolveFile={() => null} />
    </main>
  );
}
