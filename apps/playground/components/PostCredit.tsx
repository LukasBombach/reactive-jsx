// import Image from "next/image";

import type { VFC } from "react";

export interface PostCreditProps {
  date: Date;
}

export const PostCredit: VFC<PostCreditProps> = ({ date }) => {
  const dateFormat = { weekday: "long", year: "numeric", month: "long", day: "numeric" } as const;
  return (
    <a href="/" className="grid gap-x-2 items-center grid-cols-[40px_1fr] grid-rows-[40px] text-sm max-w-screen-sm">
      <img src="/lukasbombach.jpg" alt="Portrait of the author Lukas Bombach" className="rounded-full w-full h-full" />
      <p className="">
        Lukas Bombach
        <br />
        <time className="text-slate-500">{date.toLocaleDateString("en-US", dateFormat)}</time>
      </p>
    </a>
  );
};
