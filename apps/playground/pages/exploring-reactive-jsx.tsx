import { Playground } from "@reactive-jsx/playground";
import { Layout, BlogTitle, P, QuoteHighlight, Code, PostCredit, H2 } from "components";

const teaserCode = `
const Button = () => {
  let count = 1;
  return <button onClick={() => count++}>{count}</button>
};

document.body.append(rjsx.render(<Button />));`;

export default function ExploringReactiveJsx() {
  return (
    <Layout>
      <PostCredit date={new Date("8/27/2022")} />
      <header>
        <BlogTitle>Exploring compile time reactive JSX</BlogTitle>
        <blockquote className="pl-3 border-l-2 sm:pl-3 sm:border-l-4 border-slate-200 text-slate-500 max-w-screen-sm">
          Writing simpler components by transpiling away the hard parts
        </blockquote>
      </header>
      <main>
        <P>
          <span className="pb-px border-b-[3px] border-b-amber-400">Front end development is hard.</span> Sometimes, a
          statement like this would get ridiculed—&quot;back end is much more complex&quot;, they would say. But think
          about the inherent complexity of implementing a user interface. In its basic form it is a distributed system
          of independent actors that runs on parallelism and concurrency. You need to manage state—at scale—and take
          care of the details as well.
        </P>
        <P>
          Luckily, a lot of this mess can be managed through reactive UI frameworks, with React is their benevolent
          ruler. But React is not without criticism. While writing components and using <Code>useState</Code> feels
          pretty straight forward, things begin to feel less <em>obvious</em> once you have to <Code>useEffect</Code> or{" "}
          <Code>useContext</Code>. Why do we have to use hooks though?{" "}
          <span className="pb-px border-b-[3px] border-b-amber-400">Can we not just do this?</span>
        </P>
        <Playground className="my-10 max-w-screen-sm" source={teaserCode} />
      </main>
    </Layout>
  );
}
