import type { FC, ReactNode } from "react";

export { PostCredit } from "./PostCredit";

type TC<P = {}> = FC<{ children?: ReactNode } & P>;

const linkBrands = {
  twitter: "text-[#55ACEE]",
  github: "text-[#333333] dark:text-[#cdd9e5] font-medium",
  dribbble: "text-[#EA4C89]",
  tonline: "text-[#EA4C89]",
} as const;

export const DevTo = () => (
  <picture>
    <img
      src="/dev-black.png"
      alt="Logo of the website dev.to"
      width={1998 / 20}
      height={1998 / 20}
      className="inline-block h-[1em] w-auto border rounded dark:border-slate-400"
    />
  </picture>
);

export const Medium = () => (
  <picture>
    <source srcSet="Medium-Logo-White-RGB@1x.png" media="(prefers-color-scheme: dark)"></source>
    <img
      src="/Medium-Logo-Black-RGB@1x.png"
      alt="Logo of the website Medium.com"
      width={4488 / 44}
      height={1114 / 44}
      className="inline-block h-[1.2em] w-auto border rounded dark:border-slate-400"
    />
  </picture>
);

export const Layout: TC = ({ children }) => (
  <div className="grid grid-cols-1 gap-y-12 sm:gap-y-16 p-8 py-16 sm:p-24">{children}</div>
);

export const PageTitle: TC = ({ children }) => <h1 className="text-6xl font-garamond max-w-screen-sm">{children}</h1>;

export const BlogTitle: TC = ({ children }) => (
  <h1 className="text-6xl font-garamond pb-5 sm:pb-8 max-w-screen-sm">{children}</h1>
);

export const Intro: TC = ({ children }) => <p className="leading-7 text-sm max-w-screen-sm">{children}</p>;

export const P: TC<{ className?: string }> = ({ children, className }) => (
  <p className={["leading-7 text-sm mb-6 max-w-screen-sm", className].join(" ")}>{children}</p>
);

export const QuoteHighlight: TC = ({ children }) => (
  <blockquote className="-ml-5 pl-3 border-l-2 sm:pl-4 sm:border-l-[6px] sm:my-10 sm:mb-9 border-slate-200 text-slate-500 italic max-w-screen-sm">
    {children}
  </blockquote>
);

export const Code: TC = ({ children }) => (
  <code className="font-mono text-xs bg-slate-200 dark:text-slate-800 leading-5 px-[4px] rounded inline-block">
    {children}
  </code>
);

export const H2: TC = ({ children }) => <h2 className="font-bold text-lg pb-1 sm:pb-3 max-w-screen-sm">{children}</h2>;

export const BrandLink: TC<{
  href: string;
  brand?: keyof typeof linkBrands;
}> = p => (
  <a href={p.href} className={linkBrands[p.brand]}>
    {p.children}
  </a>
);

export const ArticleList: TC = ({ children }) => (
  <ul className="grid grid-cols-1 divide-y dark:divide-slate-700 text-sm max-w-screen-sm leading-6">{children}</ul>
);

export const Article: TC<{ href: string }> = p => (
  <li className="py-4">
    <a href={p.href} className="">
      {p.children}
    </a>
  </li>
);

export const Title: TC = ({ children }) => <span className="block font-semibold">{children}</span>;
export const Description: TC = ({ children }) => <span className="block opacity-60">{children}</span>;

export const Fin = () => <span className="text-slate-400 text-xs">Le Fin.</span>;
