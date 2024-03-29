import Image from "next/image";
import Head from "next/head";
import { Playground } from "@reactive-jsx/playground";
import { Layout, BlogTitle, P, Code, PostCredit, H2 } from "components";
import weatherMap from "../public/exploring-reactive-jsx/weather_map.jpg";
import weatherMapSingle from "../public/exploring-reactive-jsx/weather_map_single.jpg";

import type { FC, ReactNode } from "react";

const TM = () => <sup className="font-bold uppercase">tm</sup>;

const Highlight: FC<{ color?: "amber" | "emerald" | "sky"; children?: ReactNode }> = ({
  color = "amber",
  children,
}) => {
  const border = {
    amber: "border-b-amber-400",
    emerald: "border-b-green-500",
    sky: "border-b-sky-300",
  }[color];
  return <span className={`pb-px border-b-[3px] ${border}`}>{children}</span>;
};

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
        <H2>Intro</H2>
        <P>
          {/**
           *
           * Hey Lukas, I know you overthink things. You might find this intro terrible. Don't change it. Go with it and
           * publish the article, finally.
           *
           */}
          The discussion over how React is terrible and other frameworks are the best thing one has ever experienced is
          awfully heated. I am rooting for constructive collaboration and first and foremost, for less talking and more
          walking. Let&quot;s fuck around and see where we end up. I&apos;ll start:
        </P>

        <figure>
          <figcaption>Source https://www.tiktok.com/@rogerskaer/video/7152688876103028010</figcaption>
        </figure>

        <P>
          The discussion over how React and other frameworks is awefully heated. There differences in abstractions are
          miniscule and the mental models are similar. We need a constructive discussion and coorporate play. But enough
          of the yadda yadda, less talking, more walking:
        </P>
        <H2>less talking, more walking:</H2>
        <P>todo</P>
        <H2>Motivation:</H2>
        {/* <H2>Part 1: Understanding abstractions</H2> */}
        <P>
          Like many others, I have also noticed that React has seemingly gotten more difficult than in the olden days
          <TM />. I belive this is because, when introduced, React shrunk down a notirously difficult
          problem—implementing user interfaces—to a managable model. {/* and it has now... */}
        </P>
        <blockquote>&quot;Font end development is easy, back end development is much more complex&quot;</blockquote>
        <P>
          You may have heard this discussion before: &quot;Font end development is easy, back end development is much
          more complex&quot;. Let&apos;s debunk this just a little bit by picturing the interface of a forum thread:
        </P>
        <picture>[image here]</picture>
        <ul>
          <li>A login on the top right</li>
          <li>On top of the messages, you&apos; see who of your friends is currently online</li>
          <li>Messages in the middle, each author also has little indicator whether they are online or not</li>
          <li>A text field to enter your post</li>
        </ul>
        <P>
          Let&apos;s describe this simple example with the language of back end developers: What we have in front of us,
          in a single browser tab, is a real-time distributed system with multiple local states, some of which are
          shared, an additional global state, concurrent and parallel processes which all need to be synchronized and
          error-handled. As a bonus, synchronization and error handling are user-facing, so simply waiting for things or
          logging errors to the console are anything but acceptable solutions.
        </P>
        <figure className="max-w-screen-sm">
          {/* <Image src={weatherMap} alt="Picture of the author" width={1500} height={604} /> */}
          <Image src={weatherMapSingle} alt="Picture of the author" width={750} height={604} />
          <figcaption> Source: https://en.wikipedia.org/wiki/Weather_forecasting</figcaption>
        </figure>
        <P>
          This is not a specifically chosen example to make things seem more complex than they really are. Implementing
          user interfaces <em>is</em> complex. Literally:{" "}
          <q>A complex system is a system composed of many components which may interact with each other.</q>{" "}
          [Wikipedia](https://en.wikipedia.org/wiki/Complex_system). Complexity makes pediction hard and, conversly,
          makes control difficult.
        </P>
        <P>
          React helped making this complexity simple. &quot;Simple&quot;, of course, is always relative and a generally
          a bad choice of words in computer science, but what I mean is this: It found a way of abstracting, organizing
          and assembling the complexity of user interfaces, with all its teeny tiny details, that can be predicted and
          controlled. {/* It least, you know, potentially. The building blocks are there. */}
        </P>
        <picture>expectation v reality, image of a shit traffic jam</picture>
        <P>
          It did so, by promoting <Code>Components</Code>, <Code>State</Code> and <Code>Props</Code>. We may have gotten
          so used to this that it is easy to overlook how well this works. Especially if you consider the historic
          alternatives. Among the more popular ones are Angular and Backbone.js which come from the era right before
          React entered the stage. Back then, the hot paradigms that everyone was talking about were MVC, MVVM and other
          derivations of that. With these frameworks you very quickly got the feeling that you thought you bought a
          cabriolet sportscar to take it out for a trip on Route 66, but are now stuck in an infinite traffic jam in a
          rusty car that has a broken driver&apos;s seat. Things were entangled, hard wired to one another and were
          unnecessarily elaborate for what there were set out to accomplish. Why is React&apos;s model better? In
          practical terms:
        </P>
        <ul>
          <li>
            With <Code>Components</Code>, you can encapsulate complexity create simpler units of reactivity. These units
            are in principle uncoupled and can be put together in topography and hierarchy. Most imporantly, these units{" "}
            <em>can fit in your head</em>.
          </li>
          <li>
            With <Code>State</Code> you can take take care of fine-grained update, develop them in a smaller context, a
            context your brain can oversee, and hide them to the outside.
          </li>
          <li>
            With <Code>Props</Code> (children are props btw.) you can design a contract of <em>this</em> component to
            the others and steer the form and structure your software will take. <em>Especially</em>, when you&apos;re
            working with others.
          </li>
        </ul>
        <P>
          In a more academic explanation, this pretty much ticks or enables all the check boxes of [S.O.L.I.D.
          architecture](https://en.wikipedia.org/wiki/SOLID) and let&apos; you align well with many of the suggestions
          of [John Ousterhout&apos;s Philosophy of Software Design](https://web.stanford.edu/~ouster/cgi-bin/book.php).
        </P>
        <P>
          If you shrug at this or find this too abstract, try to find an answer how <em>you</em> would structure the
          code of your user interface with bare HTML, JavaScript and CSS. All the yadda about how things used to be
          simpler. Try implementing an input field with a list search suggestions and then have your users type real
          fast. And also, the component model isn&apos;t &quot;duh&quot;, like &quot;of course you would do it this
          way&quot;, we have <em>not</em> been doing this for quite a while—and it wasn&apos;t great.
        </P>
        <picture>picture of evolution or pomemon or something</picture>
        <P>
          The effectiveness of this model is proven by the evolutionary nature of computer science. Libraries die,
          frameworks die, but good ideas survive. This basic model has been copied and adapted by the other giants of
          the industry. Svelte, Solid, Vue—they have their own twists and turns and they come with their own USP, but
          they do have that idea in common. Can you see that? There are many other frameworks out there, some backed by
          large corporations, but they are not popular. Of course there&apos;s more than one reason for that, but it
          seems hard to ignore that the frameworks developers seem to adopt all share this core pattern.
        </P>
        <P>
          Like in evolution, we might see other paradigms some day. Or this paradigm will adopt and grow to become
          something else. Something even better fitting to what we want to achieve. Things are always in constant
          change. Better ideas will supersede what is here today. As a famous quote by Buckminister Fuller goes
        </P>
        <blockquote>
          You never change things by fighting the existing reality. To change something, build a new model that makes
          the existing model obsolete.
        </blockquote>
        <P>
          Conversely, a new model that&apos;s worse than the old model, will go down unnoticed, be ridiculed or, when
          enforced, create resistance. In regards to React, something has changed, and I belive it is that with hooks,
          we have migrated from a simplistic reactive model to being exposed to fin<em>er</em> grained reactive
          programming.
        </P>
        <P>
          In the olden days
          <TM /> there were components and maybe a bit knowledge about their lifecycle in React&apos;s runtime. That was
          the end of complexity. I belive, when hooks came along, many developes tried to take this mindset and
          implement that with hooks. Famously, <Code>useEffect</Code> is one of the first moments they would realize
          that things are a bit different now.
        </P>
        <P>
          But it is not the syntax, that is challenging. Knowing how to import `useEffect` and calling it is not hard.
          It is the shift in the mental model that makes it difficult.
          <Highlight>
            `useEffect` requires developers to move away from thinking in components and lifecycles to a more detailed
            understanding of reactive programming.
          </Highlight>
          In reactive programming, you need to see values, executions and their dependencies. You need to think about
          which of your chages will cause other changes and any implications of that, be it in terms of product or in
          terms of performance. This is a much more complex and task.
          {/* In reactive programming values get updated and functions get executed, whenever something they are built upon{" "}
          <em>changes</em>. When you have a  <Code>let a = b + c;</Code> */}
          {/* In the olden days
          <TM /> you might think about a component that rerenders. In reactive programming, you think about values that
          get updated and functions that get executed, whenever something they are built upon <em>changes</em>. They{" "}
          <em>react</em> to their */}
        </P>
        <P>
          I would not do justice to React to claim that there was no thinking in reactivity before hooks, of course
          there was, it is right in the name. But it was a simpler model of it. Also, it&apos;s probably also wrong to
          claim that <em>all React devs</em> were thinking like X and now <em>all React devs have to think like Y</em>.
          But at least from my observation, the majority of problem solving with React apps revolved around components,
          props, state and lifecycles, whereas now disucssions are fine-grained and consider details of{" "}
          <em>reactive computaional work</em> that can be saved here and there and why X leads to Y, in other words, how
          the reactivity works. It doesn&apos;t seem to be a coincidence. When <Code>useEffect</Code> was discussued
          upon its introduction, many devs recognized that <Code>componentDidMount</Code> and{" "}
          <Code>componentWillUnmount</Code> could be mimicked by using its setup and teardown functionality, but it has
          been discouraged to do so and instead pointed out that it is meant to work differently.
          {/* Funnily, when
          talking about optimizing code with <Code>useMemo</Code>, <Code>useCallback</Code> and other optimizations to
          prevent unneccessary reactivity, we still use the term <Highlight>rerendering</Highlight>, which, in a way is
          what React does, but to me, is a bit of a pointer to the ambivalent state the mental model that most people
          have of React is in */}
        </P>
        <P>
          So, this sounds like I want to paint a picture of something that was good and simple before and is now
          complicated and difficult. It is not my intention to do that. Instead I am going to pull the &quot;it
          depends&quot;-card. But HEY! Don&apos;t close this tab yet! Let me explain!
        </P>
        <H2>Part 2: Comparing abstractions</H2>
        <P>
          The succuessful frameworks are all based on reactive programming, and they all seem to encompass a model of
          components. But they do differ in the details. In the end <em>they all do the same thing</em>. They update the
          user interface efficiently and they provide APIs for us developers to fulfil the tasks we have to fulfil. The
          difference is in the <em>coice of abstractions</em>. Some are more fitting for yxxx details perf ext,
          examplses
        </P>
        <H2>Part 3: Constructive play</H2>
        <P>[everything is a remix]</P>
        {/* <P>
          And I don&apos;t mean to say that this is bad. [use cases yadda yardds] And I would not do justice to React if
          I said that kind of thinking was completely absent before hooks, but this new style is much more previlent
          right now.
        </P>

        <P>
          <Code>useEffect</Code>&apos;s cleanup is not the same as unmounting a component. In fact{" "}
          <Code>useEffect</Code>, conceptually speaking, is not part of the pedigree of React and its runtime, but that
          of reactive programming. It is now part of our canon that an effect is &quot;a side effect that should be
          re-executed when (and only when) some designated dependencies get updated&quot;.
        </P>

        <P>
          That is... <em>drumroll</em>... reactive programming. Having to think about which data depends on which other
          data and what should happen when things change. And quite importantly, you need to think about optimizing
          this. React takes this a bit further with hooks <Code>useMemo</Code>, <Code>useCallback</Code>,{" "}
          <Code>useRef</Code>, <Code>useTransition</Code> these are great tools for writing performant, optimized
          reactive code.
        </P> */}
        <ul>
          <li>[no one size fits all]</li>
          <li>[crtiqe from that article: different kinds if abstractions für reactivitiy]</li>
          <li>
            [different asbstractions provide diferent mental models of how things work and what is happening behind the
            scenes. some provide benefits for DX at the cost of control and insight, others go the other way around]
          </li>
          <li>
            [just for fun (link to just for fun) and as a genuine and constructute contribution to explore the
            possiblities of abstractions]
          </li>
          <li>
            [let&apos;s try another extreme: abstracting it all away at compile time. no knowledge of a runtime
            required, a mental model of possbile states and maybe an &quot;it just works&quot; feeling]
          </li>
        </ul>
      </main>
    </Layout>
  );
}
