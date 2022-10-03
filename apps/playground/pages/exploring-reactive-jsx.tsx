import Image from "next/image";
import { Playground } from "@reactive-jsx/playground";
import { Layout, BlogTitle, P, Code, PostCredit, H2 } from "components";

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
        <H2>Part 1: Understanding abstractions</H2>
        <P>
          Like many others, I have also noticed that React has seemingly gotten more difficult than in the olden days
          <TM />. I belive this is because, when introduced, React shrunk down a notirously difficult
          problem—implementing user interfaces—to a managable model.
        </P>

        <P>
          If you ever hear a back end person say that front end is easy and back end is the real deal, you might want to
          point out that user interfaces are a real-time distributed systems with local and shared states that need to
          synchonization of both, concurrent and parallel processes. Not to mention that these systems do not{" "}
          <em>just have to work</em>, they have to work in a way that is presentable to humans. This imposes further
          complexity on how to deal with error handling, state and time. In a non user-facing system it might be ok to
          have one part idly wait for some other part and in case of an error just log it and call it a day. But in a
          user-facing system, these approaches become too simple, things get more complex and encompass a wider
          cross-disciplinary understanding.
        </P>

        <P>
          React made this complexity simple. &quot;Simple&quot;, of course, is relative in nature and a generally a bad
          choice of words in computer science, but what I mean is that it shrunk down the complexity and{" "}
          <em>simplified</em> it to a mental model that makes the complexity managable (you know, at least potentially).
        </P>
        <P>
          It did so, by promoting <Code>Components</Code>, <Code>State</Code> and <Code>Props</Code>. These things
          together make up the building blocks that enable managing the distributed and intervened mess, which user
          interfaces usually are.
        </P>

        <ul>
          <li>
            <Code>Components</Code> encapsulate complexity and allow creating manageble units of reactivity
          </li>
          <li>
            <Code>State</Code> allows fine-grained, internal updates, hidden to the outside
          </li>
          <li>
            <Code>Props</Code> allow designing dependencies and contraints to relationships between components
          </li>
        </ul>

        <P>
          This list might seem trivial, but before React rose in popularity, the common approaches to UI on the web were
          based on MCV / MVVM type paradims, which attempted to solve complex UIs by enforcing an order to where and how
          updates would happen, but still ended up being a complex maze, only adding guard rails that you would now trip
          over and fall. The larger Angular and Backbone apps I woked with felt like a broken corset, where there were
          pointy wires poking into my ribs.
        </P>

        <P>
          Compenents let me choose my own misery. Oh that sounds bad, but I mean it well. Of couse, a larger React
          project is often just as hard to maintain as any other project, but this is not due to this core design. This
          core design is Lego which, solves a lot and prevents nothing. This should make any software architect happy.
        </P>

        <P>
          The effectiveness of this model is proven by the evolutionary nature of computer science. Libraries die,
          frameworks die, but good ideas survive. This basics model has been copied and adapted by the other giants of
          front end development. Svelte, Solid, Vue—they have their own twists and USPs, but they do have that idea in
          common. Can you see that? There are many other frameworks out there, some backed by large corporations, but
          they are not popular. Of course there&apos;s more than one reason for that, but it seems hard to ignore that
          the frameworks developers seem to adopt all share this core pattern.
        </P>

        <P>
          Like in evolution, we might see other paradigms some day. Or this paradigm will adopt and grow to become
          something else. Something even better fitting to what we want to achieve. Things are always in constant
          change. Better things supersede what was before. As a famous quote by Buckminister Fuller goes
        </P>

        <blockquote>
          You never change things by fighting the existing reality. To change something, build a new model that makes
          the existing model obsolete.
        </blockquote>

        <P>
          Conversely, a new model that&apos;s worse than the old model, will be ignored, ridiculed or, when enforced,
          creates resistance. In regards to React, something has changed, and I belive it is that with hooks, we have
          migrated from a simplistic reactive model to being exposed to fin(er) grained reactive programming.
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

        <H2>Part 2: Seeing abstractions</H2>

        <P>
          The succuessful frameworks are all based on reactive programming, and they all seem to encompass a model of
          components. But they do differ in the details. In the end <em>they all do the same thing</em>. They update the
          user interface efficiently and they provide APIs for us developers to fulfil the tasks we have to fulfil. The
          difference is in the <em>coice of abstractions</em>. Some are more fitting for yxxx details perf ext,
          examplses
        </P>

        <H2>Part 3: Cooperative Play</H2>
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
