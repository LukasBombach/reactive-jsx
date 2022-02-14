import { Playground } from "components/Playground";

export default function Home() {
  const code = "console.log('hello coasasdasddasde');";

  return (
    <main className="h-screen">
      <Playground code={code} />
    </main>
  );
}
