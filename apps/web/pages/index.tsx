import dynamic from "next/dynamic";

const Playground = dynamic(() => import("components/Playground"), { ssr: false });

export default function Home() {
  const initialSource = "console.log('hello world');";

  return (
    <main className="h-screen">
      <Playground initialSource={initialSource} />
    </main>
  );
}
