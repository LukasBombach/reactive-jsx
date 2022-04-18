import { useEffect, useRef } from "react";

import type { FC, MouseEventHandler, ReactNode } from "react";

// todo cleanup
// todo moving the pane has a little overshoot left and right
// todo respect hor. scrolling in calcs
export const SplitPane: FC<{ children: [ReactNode, ReactNode]; intitialPos?: number }> = ({ children }) => {
  const container = useRef<HTMLDivElement | null>(null);
  const mousePos = useRef<number | null>(null);
  const [left, right] = children;

  const onMouseDown: MouseEventHandler<HTMLDivElement> = e => {
    e.preventDefault();
    e.stopPropagation();
    var rect = (e.target as HTMLDivElement).getBoundingClientRect();
    mousePos.current = e.clientX - rect.left;
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!mousePos.current || !container.current) return;
    const c = container.current.getBoundingClientRect();
    const left = e.clientX - mousePos.current - c.left - 24; // todo scrolling
    const pos = (left / (c.width - 48)) * 100;
    const cappedPos = Math.min(Math.max(pos, 10), 90);
    container.current.style.setProperty("--split", cappedPos + "%");
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
    <div className="grid grid-rows-1 grid-cols-[var(--split,50%)_14px_1fr]" ref={container}>
      {left}
      <div className="grid place-content-center">
        <div className="w-1 h-24 bg-[#ffffff05] rounded-xl cursor-col-resize" onMouseDown={onMouseDown} />
      </div>
      {right}
    </div>
  );
};
