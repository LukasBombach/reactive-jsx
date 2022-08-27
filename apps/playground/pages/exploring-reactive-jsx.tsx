import { Playground } from "@reactive-jsx/playground";
import { Layout, BlogTitle, P, QuoteHighlight, Code, PostCredit, H2 } from "components";

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
          Implementing complex user interfaces is by no means trivial. Concurrent Whoever argues Whoever argues
          otherwise
          <strong className="pb-px border-b-[3px] border-b-sky-300">React is a great libary.</strong> It helps
          implemeting user interfaces
        </P>
      </main>
    </Layout>
  );
}
