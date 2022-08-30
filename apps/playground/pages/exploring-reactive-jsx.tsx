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
          Implementing user interfaces is by no means a trivial task. React has made this remarkably simply, relatively
          speaking. Before React we had numerous contesters and a list of paradigms that came with abbreviations that
          felt more like spelling contest than a … .
        </P>

        <P>
          Among the more noteworthy ones were Backbone.js, which promoted an MVC-style paradigm as well as AngularJS,
          which went one step further and promised a one stop solution to all needs a front end would ever have. Both
          frameworks, I would argue, can safely be considered legacy now.
        </P>

        <P>
          React is here since 2013 and still <em>hot</em>. Why? I think did one thing very well. It promoted a mental
          model that actually fits in your head. Don&apos;t get me wrong, things still get messy, most code does, but
          even then, the mess can be managed and cleaned up. The basic idea allow that.
        </P>

        <P>
          All this comes down to the mental model of <Code>components</Code>, <Code>props</Code>, <Code>children</Code>{" "}
          and <Code>state</Code>. Components encapsulate complexity and create manageble mental units. Props and
          children define dependencies and relationships between units and state enables reactive programming in an
          almost declarative way.
        </P>

        <P>
          The way React handles <Code>state</Code>, to me, is one of the greatest tricks. Especially in the early days
        </P>
      </main>
    </Layout>
  );
}
