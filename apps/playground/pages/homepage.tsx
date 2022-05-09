import Image from "next/image";
import mediumLogo from "../public/Medium-Logo-White-RGB@1x.png";
import devToLogo from "../public/dev-black.png";

import type { FC, ReactNode } from "react";

const page = "px-8 py-4 sm:px-16 sm:py-12 xl:px-48 xl:py-24 grid gap-8";
const title = "leading-tight text-7xl max-w-screen-sm font-garamond";
const articles = "leading-tight text-4xl max-w-screen-sm font-garamond";
// const tonline = "text-[#E20074]";
const twitter = "text-[#55ACEE]";
const github = "text-[#333333] dark:text-[#cdd9e5]";
const dribbble = "text-[#EA4C89]";

export default function HomePage() {
  return (
    <main className={page}>
      <h1 className={title}>Unfinished thought</h1>
      <p>
        Hi, my name is Lukas Bombach, I work as a front end developer for{" "}
        <a className={dribbble} href="https://www.t-online.de/">
          t-online.de
        </a>{" "}
        in Berlin.
        <br />
        This is my blog where I post experimental code and thoughts on software development.
        <br />
        You can find me elsewhere on{" "}
        <a className={twitter} href="https://twitter.com/luke_schmuke">
          Twitter
        </a>
        ,{" "}
        <a className={github} href="https://github.com/LukasBombach/">
          GitHub
        </a>{" "}
        and{" "}
        <a className={dribbble} href="https://dribbble.com/luke_schmuke">
          Dribbble
        </a>
        .
      </p>
      <h2 className={articles}>Articles</h2>
      <ul className="grid grid-cols-1 divide-y dark:divide-slate-700 max-w-screen-sm">
        <li className="py-6">
          <a href="/">Exploring compile time reactive JSX</a>
        </li>
        <li className="py-6">
          <a href="https://dev.to/lukasbombach/how-to-write-a-tree-shakable-component-library-4ied">
            How to write a tree-shakable component library{" "}
            <Image
              src={devToLogo}
              alt="Logo of the website dev.to"
              width={1998 / 20}
              height={1998 / 20}
              layout="raw"
              className="inline-block h-[1em] w-auto border rounded dark:border-slate-400"
            />
          </a>
        </li>
        <li className="py-6">
          <a href="https://medium.com/@luke_schmuke/how-we-achieved-the-best-web-performance-with-partial-hydration-20fab9c808d5">
            The case of partial hydration (with Next and Preact){" "}
            <Image
              src={mediumLogo}
              alt="Logo of the website Medium.com"
              width={4488 / 44}
              height={1114 / 44}
              layout="raw"
              className="inline-block h-[1em] w-auto border rounded dark:border-slate-400"
            />
          </a>
        </li>
      </ul>
    </main>
  );
}
