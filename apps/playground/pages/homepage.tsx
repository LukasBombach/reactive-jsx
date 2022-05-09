import type { FC, ReactNode } from "react";

type TC<P = {}> = FC<{ children: ReactNode } & P>;

const linkBrands = {
  twitter: "text-[#55ACEE]",
  github: "text-[#333333] dark:text-[#cdd9e5] font-medium",
  dribbble: "text-[#EA4C89]",
  tonline: "text-[#EA4C89]",
} as const;

const DevTo = () => (
  <picture>
    <img
      src="dev-black.png"
      alt="Logo of the website dev.to"
      width={1998 / 20}
      height={1998 / 20}
      className="inline-block h-[1em] w-auto border rounded dark:border-slate-400"
    />
  </picture>
);

const Medium = () => (
  <picture>
    <source srcSet="Medium-Logo-White-RGB@1x.png" media="(prefers-color-scheme: dark)"></source>
    <img
      src="Medium-Logo-Black-RGB@1x.png"
      alt="Logo of the website Medium.com"
      width={4488 / 44}
      height={1114 / 44}
      className="inline-block h-[1.2em] w-auto border rounded dark:border-slate-400"
    />
  </picture>
);

const Layout: TC = ({ children }) => (
  <div className="grid grid-cols-1 gap-y-10 sm:gap-y-16 p-8 sm:p-24">{children}</div>
);

const H1: TC = ({ children }) => <h1 className="text-4xl font-garamond pb-4 sm:pb-8 max-w-screen-sm">{children}</h1>;
const Intro: TC = ({ children }) => <p className="leading-7 text-sm max-w-screen-sm">{children}</p>;
const H2: TC = ({ children }) => <h1 className="font-bold text-lg pb-2 sm:pb-4 max-w-screen-sm">{children}</h1>;

const BrandLink: TC<{
  href: string;
  brand?: keyof typeof linkBrands;
}> = p => (
  <a href={p.href} className={linkBrands[p.brand]}>
    {p.children}
  </a>
);

const ArticleList: TC = ({ children }) => (
  <ul className="grid grid-cols-1 divide-y dark:divide-slate-700 text-sm max-w-screen-sm leading-6">{children}</ul>
);

const Article: TC<{ href: string }> = p => (
  <li className="py-4">
    <a href={p.href}>{p.children}</a>
  </li>
);

const Title: TC = ({ children }) => <span className="block font-semibold">{children}</span>;
const Description: TC = ({ children }) => <span className="block text-slate-500">{children}</span>;

const Fin = () => <span className="italic text-slate-300 text-sm">Le Fin.</span>;

export default function HomePage() {
  return (
    <Layout>
      <header>
        <H1>Unfinished thought</H1>
        <Intro>
          Hi, my name is Lukas Bombach, I work as a front end developer for{" "}
          <BrandLink brand="tonline" href="https://www.t-online.de/">
            t-online.de
          </BrandLink>{" "}
          in Berlin.
          <br />
          <span className="hidden sm:inline">
            This is my blog where I post experimental code and thoughts on software development.
            <br />
          </span>
          You can find me elsewhere on{" "}
          <BrandLink brand="twitter" href="https://twitter.com/luke_schmuke">
            Twitter
          </BrandLink>
          ,{" "}
          <BrandLink brand="github" href="https://github.com/LukasBombach/">
            GitHub
          </BrandLink>{" "}
          and{" "}
          <BrandLink brand="dribbble" href="https://dribbble.com/luke_schmuke">
            Dribbble
          </BrandLink>
          .
        </Intro>
      </header>
      <main>
        <H2>Articles</H2>
        <ArticleList>
          <Article href="/">
            <Title>Exploring compile time reactive JSX</Title>
            <Description>Writing simpler components by transpiling away the hard parts</Description>
          </Article>
          <Article href="https://dev.to/lukasbombach/how-to-write-a-tree-shakable-component-library-4ied">
            <Title>
              How to write a tree-shakable component library <DevTo />
            </Title>
            <Description>
              You probably don't need all components on all pages. A walkthrough on making tree-shaking happen
            </Description>
          </Article>
          <Article href="https://medium.com/@luke_schmuke/how-we-achieved-the-best-web-performance-with-partial-hydration-20fab9c808d5">
            <Title>
              The case of partial hydration (with Next and Preact) <Medium />
            </Title>
            <Description>
              Less JavaScript means better performance. Better performance means a better user experience
            </Description>
          </Article>
        </ArticleList>
      </main>
      <footer>
        <Fin />
      </footer>
    </Layout>
  );
}
