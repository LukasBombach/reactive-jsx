import { useState, useEffect, useRef } from "react";
import { splitPane } from "./playground.module.css";

import type { FC, MouseEventHandler, ReactNode } from "react";

export const SplitPane: FC<{ children: [ReactNode, ReactNode]; intitialPos?: number }> = ({
  children,
  intitialPos = 55,
}) => {
  const container = useRef<HTMLDivElement | null>(null);
  const mousePos = useRef<number | null>(null);
  const [pos, setPos] = useState(intitialPos);
  const [left, right] = children;

  const onMouseDown: MouseEventHandler<HTMLDivElement> = e => {
    var rect = e.target.getBoundingClientRect();
    mousePos.current = e.clientX - rect.left;
  };

  const onMouseUp = () => (mousePos.current = null);

  const onMouseMove = (e: MouseEvent) => {
    if (!mousePos.current || !container.current) return;
    const c = container.current.getBoundingClientRect();
    const left = e.clientX - mousePos.current - c.left - 24; // todo scrolling
    const newPos = (left / (c.width - 48)) * 100;
    setPos(newPos);
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
    <div className={["p-6", splitPane].join(" ")} style={{ "--split-at": `${pos}%` }} ref={container}>
      {left}
      <div className="grid place-content-center">
        <div className="w-1 h-24 bg-[#ffffff05] rounded-xl cursor-col-resize" onMouseDown={onMouseDown} />
      </div>
      {right}
    </div>
  );
};
