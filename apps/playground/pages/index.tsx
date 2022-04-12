import dynamic from "next/dynamic";

const Playground = dynamic(() => import("@reactive-jsx/playground"), { ssr: false });

const source = `
const Component = () => {
  let count = 0;

  return (
    <button onClick={() => count = count + 1}>
      Clicked {count}
    </button>
  )
};

document.body.append(<Component />);`.trim();

export default function Home() {
  return <Playground source={source} resolveFile={() => null} />;
}
