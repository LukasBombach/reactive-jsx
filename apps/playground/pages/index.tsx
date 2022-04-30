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

const Button = () => (
  <button onClick={() => count = count + 1}>
    Clicked {count}
  </button>
);

const Result = () => <h1>The answer is {count}</h1>;

document.body.append(<Button />, <Result />);`;

const developmentCode = `
const first = 'Rick';
const last = 'Astley';

const Name = ({ name }) => {
  let age = 30;

  return (
    <button onClick={() => { age = age + 1; console.log(age); }} name={\`button-\${age}\`} value={age}>
      His name is {name}. He is {age} years old.
    </button>
  );
};

document.body.append(<Name name={first} />);`;

export default function Home() {
  return (
    <main className="px-8 py-4 sm:px-16 sm:py-12 xl:px-48 xl:py-24 grid gap-8 text-slate-800 bg-grey-50">
      <h1 className="leading-tight text-7xl max-w-screen-sm font-garamond">Exploring compile time reactive JSX</h1>
      <Playground className="max-w-screen-lg" source={developmentCode} resolveFile={() => null} />
      {/* <blockquote className="pl-3 border-l-4 border-slate-200 text-slate-500 max-w-screen-sm">
        Note: When this shows up in the git history, this text will be super emberrassing. I am writing this text only
        to find a narrative which I can write code examples for. This way I can find an idea which features to
        implement.
      </blockquote>
      <p className="max-w-screen-sm">What if you could write react components like this?</p>
      <Playground className="max-w-screen-lg" source={initialExample} resolveFile={() => null} />
      <p className="max-w-screen-sm">
        No <code>setCount</code>, no <code>useEffect</code>. You just define a variable and then change it. The
        component is updated accordingly.
      </p>
      <p className="max-w-screen-sm">
        Well, you can, try it. You find <code>Context</code> annoying and a hassle to work with? So do I, why can't we
        just define a variable and use it in more than one component? You can!
      </p>
      <Playground className="max-w-screen-lg" source={insteadOfReactContext} resolveFile={() => null} /> */}
    </main>
  );
}
