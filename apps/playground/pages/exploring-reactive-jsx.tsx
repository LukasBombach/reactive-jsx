import Image from "next/image";
import { Playground } from "@reactive-jsx/playground";
import { Layout, BlogTitle, P, Code, PostCredit } from "components";

import type { FC, ReactNode } from "react";

const TM = () => <sup className="font-bold uppercase">tm</sup>;

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
          Like many others, I have also noticed that React has seemingly gotten more difficult than in the olden days
          <TM />. I belive this is because, when introduced, React shrunk down a notirously difficult
          problem—implementing user interfaces—to a managable model.
        </P>

        <P>
          If you ever hear a back end person say that front end is easy and back end is the real deal, it&apos;s worth
          pointing out that a very basic user interface is a real-time distributed system with multiple local and shared
          states that manages both, concurrency and parallelism. Not to mention that this system does not only have to
          work, it needs work in a presentable way, presentable to humans that is. This imposes further complexity on
          how you have to do state and error handling. In a non user-facing system it might be ok to have one part idly
          wait for some other part to do something or—in case of an error, just log it to Kibana and call it a day—but
          users need instant and sometimes complex solutions for these problems.
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
          In the olden days <TM /> there were components and maybe a bit knowledge about their lifecycle in React&apos;s
          runtime. That was the end of complexity. When hooks came along, I think a lot of people just tried to take
          this mindset and implement that with hooks. Famously, <Code>useEffect</Code> is one of the first moments they
          would realize that things seem to be a bit different now.
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
        </P>

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
