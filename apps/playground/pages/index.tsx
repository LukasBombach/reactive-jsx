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
  return <Playground source={source.trim()} resolveFile={() => null} />;
}
