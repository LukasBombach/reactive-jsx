import dynamic from "next/dynamic";

const Playground = dynamic(() => import("components/Playground"), { ssr: false });

const initialSource = `const text = "abc";
const el = <div data-text={text} />;`;

export default function Home() {
  return (
    <main className="h-screen">
      <Playground initialSource={initialSource} />
    </main>
  );
}
