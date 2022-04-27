import { useEffect, useRef } from "react";

import type { FC, MouseEventHandler, ReactNode } from "react";

// todo cleanup
// todo moving the pane has a little overshoot left and right
// todo respect hor. scrolling in calcs
// todo mouse events get lost when hovering the iframe of the result
// todo [1 ]the pointer events thing is a cheap hack to prevent losing the mouse when moving over iframes and such
export const SplitPane: FC<{ children: [ReactNode, ReactNode]; className?: string; intitialPos?: number }> = ({
  children,
  className,
}) => {
  const container = useRef<HTMLDivElement | null>(null);
  const handle = useRef<HTMLDivElement | null>(null);
  const mousePos = useRef<number | null>(null);
  const [left, right] = children;

  const onMouseDown: MouseEventHandler<HTMLDivElement> = e => {
    e.preventDefault();
    e.stopPropagation();
    var rect = (e.target as HTMLDivElement).getBoundingClientRect();
    mousePos.current = e.clientX - rect.left;
    document.body.style.pointerEvents = "none"; // [1]
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

  const onMouseUp = () => {
    mousePos.current = null;
    document.body.style.pointerEvents = "auto"; // [1]
  };

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
      className={[
        "relative grid grid-rows-1 grid-cols-[var(--split,62%)_calc(100%-var(--split,calc(100%-62%)))] bg-[#282c34] rounded-xl overflow-hidden drop-shadow-md",
        className,
      ].join(" ")}
      ref={container}
    >
      {left}
      {right}
      <div
        className="absolute w-1 h-24 bg-[#ffffff10] rounded-xl cursor-col-resize top-[62%] left-[var(--split,62%)] -translate-y-[62%]"
        onMouseDown={onMouseDown}
        ref={handle}
      />
    </section>
  );
};
