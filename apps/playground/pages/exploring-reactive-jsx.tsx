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
        <H2>
          <span className="pb-px border-b-[3px] border-b-sky-300">An ode to React</span> and an opinion <em>why</em>{" "}
          works
        </H2>
        <P>
          When I was adopting React in 2015, life got a lot easier. Writing user interfaces was a bit of a mess. We have
          been battling with all sorts of concepts and abbreviations. MVC, MVP, MVVM, yikes! It was a creative time
          though. Many of the big names from that era are now forgotten or have fallen from grace. RIP Backbone! And
          Angular... let&apos;s just keep this between us, ok?
        </P>
        <P>
          On the other hand, React stood the test of time. <em>Something</em> is good about React. My take is that it
          introduced a mental model that is properly managable in your head.
        </P>
        <P>
          If you want to write a user interface, you will have to deal with multiple states that intersect and that do
          so <em>over time</em>. Say you are building Twitch and to show a stream you need to load the videplayer, the
          stream data and display whatever <em>Pokimane</em> is doing while the other things are loading.<sup>1</sup>
        </P>

        <P>
          <Code>[image of the problem here]</Code>
        </P>

        <P>
          When any of those things are loaded or <em>Pokimane</em> wrote a message or whatever, you now have to decide
          how to update the UI keeping in mind that each update can happen at any point in time and you will have to
          account for any combination of all those states.
        </P>

        <P>
          <span className="pb-px border-b-[3px] border-b-sky-300">React solved this nicely</span> by implementing a
          reactive UI library and introducing a mental model that makes reactive programming feel easy while it is
          actually hard.
        </P>

        <P>
          <QuoteHighlight>
            Reactive programming allows us to say &quot;Look, I have a variable, whenever I change it, please
            automatically run some code for me, like I an event listener or something&quot;. In our example we could say
            &quot;Look, here&apos;s are the loading states and the messages from <em>Pokimane</em>, whenever I update
            those, please do rerender the UI&quot;. You can even say, when I update this value, update this part of the
            UI, when I update that value update other parts. Sounds familiar? That&apos;s React.
          </QuoteHighlight>
        </P>

        <P>
          With React you can split your complex problem into multiple components, assemble the parts and organize the
          complexity of state in a way that fits in your head. The greatest trick in this, is that you have defined the
          problem of time out of existence. You have variables that are stateful, you write code that accounts for their
          permutations, but you generally don&apos;t have to think about when things happen or in which order.
        </P>

        <P>
          All this comes down to the mental model of <Code>components</Code>, <Code>props</Code> and <Code>state</Code>.
          Components encapsulate complexity and create manageble units of reactivity<sup>2</sup>. Props design
          dependencies and internal state allow fine-grained updates. React&apos;s runtime takes care of the hard parts,
          including issues of time, and of course other things like performance etc.
        </P>

        <P>
          <sup>1 Ok fine, I had to google &quot;most famous Twitch streamers&quot; because I am not 14 anymore</sup>
          <br />
          <sup>2 Let&apos;s say, at least potentially.</sup>
        </P>
      </main>
    </Layout>
  );
}
