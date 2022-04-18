import { Playground } from "@reactive-jsx/playground";

const source = `
const Component = () => {
  let count = 0;

  return (
    <button onClick={() => count = count + 1}>
      Clicked {count}
    </button>
  )
};

document.body.append(<Component />);`;

export default function Home() {
  return (
    <main className="container mx-auto grid gap-6 py-8">
      <h1 className="font-bold leading-tight text-5xl">Playground</h1>
      <Playground source={source.trim()} resolveFile={() => null} />
    </main>
  );
}
