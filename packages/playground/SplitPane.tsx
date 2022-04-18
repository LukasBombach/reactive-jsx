import { useEffect, useRef } from "react";

import type { FC, MouseEventHandler, ReactNode } from "react";

// todo cleanup
// todo moving the pane has a little overshoot left and right
// todo respect hor. scrolling in calcs
export const SplitPane: FC<{ children: [ReactNode, ReactNode]; intitialPos?: number }> = ({ children }) => {
  const container = useRef<HTMLDivElement | null>(null);
  const handle = useRef<HTMLDivElement | null>(null);
  const mousePos = useRef<number | null>(null);
  const [left, right] = children;

  const onMouseDown: MouseEventHandler<HTMLDivElement> = e => {
    e.preventDefault();
    e.stopPropagation();
    var rect = (e.target as HTMLDivElement).getBoundingClientRect();
    mousePos.current = e.clientX - rect.left;
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!mousePos.current || !container.current || !handle.current) return;
    const c = container.current.getBoundingClientRect();
    const left = e.clientX - mousePos.current - c.left - 24; // todo scrolling
    const pos = (left / (c.width - 48)) * 100;
    const cappedPos = Math.min(Math.max(pos, 10), 90);
    container.current.style.setProperty("--split", cappedPos + "%");
    handle.current?.style.setProperty("--split", cappedPos + "%");
  };

  const onMouseUp = () => (mousePos.current = null);

  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  });

  return (
    <section
      className="relative grid grid-rows-1 grid-cols-[var(--split,55%)_1fr] bg-[#282c34] rounded-xl overflow-hidden drop-shadow-md"
      ref={container}
    >
      {left}
      {right}
      <div
        className="absolute w-1 h-24 bg-[#ffffff10] rounded-xl cursor-col-resize top-[55%] left-[var(--split,55%)] -translate-y-[55%]"
        onMouseDown={onMouseDown}
        ref={handle}
      />
    </section>
  );
};
