import { bundle } from "bundler";
// import dynamic from "next/dynamic";

// const Playground = dynamic(() => import("components/Playground"), { ssr: false });

bundle().then(result => {
  console.log(result);
});

export default function Home() {
  const code = "console.log('hello world');";

  return <main className="h-screen">{/* <Playground code={code} /> */}</main>;
}
