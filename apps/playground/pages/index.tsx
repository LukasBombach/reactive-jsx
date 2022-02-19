import dynamic from "next/dynamic";

const Playground = dynamic(() => import("components/Playground"), { ssr: false });

const initialSource = `const child = "test";
const el = <h1>Dies ist ein {child}</h1>;
document.body.append(el);`;

export default function Home() {
  return (
    <main className="h-screen">
      <Playground initialSource={initialSource} />
    </main>
  );
}
