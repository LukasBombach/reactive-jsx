import { useState, useEffect, useRef, createRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { useCompiler } from "./useCompiler";
import { splitPane } from "./playground.module.css";

import type { VFC, MouseEventHandler } from "react";
import type { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import type { ResolveFile } from "./compiler";

// const onMouseMove = (e: MouseEvent) => console.log(e.offsetX);
// container.current?.addEventListener("mousemove", onMouseMove);
// container.current?.removeEventListener("mousemove", onMouseMove);

/* function useSplitHandle<H extends HTMLElement = HTMLDivElement, C extends HTMLElement = HTMLDivElement>(
  initialPos: number
): [container: MutableRefObject<H | null>, handle: MutableRefObject<H | null>, pos: number] {
  const [pos, setPos] = useState(initialPos);
  const container = useRef<H | null>(null);
  const handle = useRef<H | null>(null);

  useEffect(() => {
    if (!handle.current) return;

    const onDragStart = () => console.log("onDragStart");
    const onDragEnd = () => console.log("onDragEnd");

    const onMouseDown = () => console.log("mousedown");
    const onMouseUp = () => console.log("mouseup");

    handle.current.draggable = true;
    handle.current.addEventListener("mousedown", onMouseDown);
    document.body.addEventListener("mouseup", onMouseUp);

    return () => {
      if (!handle.current) return;
      handle.current.removeEventListener("mousedown", onMouseDown);
      document.body.removeEventListener("mouseup", onMouseUp);
      handle.current.draggable = false;
    };
  });

  return [container, handle, pos];
} */

export const Playground: VFC<{ source: string; resolveFile: ResolveFile }> = ({ source, resolveFile }) => {
  // const [container, handle, pos] = useSplitHandle(55);
  const [compiledSource, setSource] = useCompiler(source, resolveFile);
  const container = useRef<HTMLDivElement | null>(null);
  const mousePos = useRef<number | null>(null);

  const [pos, setPos] = useState(55);

  const onMouseDown: MouseEventHandler<HTMLDivElement> = e => {
    var rect = e.target.getBoundingClientRect();

    mousePos.current = e.clientX - rect.left;
    console.log("rect.left", rect.left, "e.clientX", e.clientX, "mousePos.current", mousePos.current);
  };

  const onMouseUp = () => {
    mousePos.current = null;
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!mousePos.current || !container.current) return;

    const h = e.currentTarget;
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
    <section className="bg-[#282c34] rounded-xl overflow-hidden drop-shadow-md">
      <header className="grid grid-cols-12 gap-4 p-6 bg-[#ffffff0a] px-6 py-3">
        <div className="col-span-7 flex gap-4">
          <span className="text-xs text-slate-200 py-1">app.js</span>
        </div>
        <div className="col-span-5 flex gap-4">
          <button className="text-xs text-slate-200 py-1 cursor-pointer">Result</button>
          <button className="text-xs text-slate-200 py-1 border-b border-amber-400 cursor-pointer">JS Output</button>
        </div>
      </header>
      <div className={["p-6", splitPane].join(" ")} style={{ "--split-at": `${pos}%` }} ref={container}>
        <Editor value={source} onChange={setSource} />
        <div className="grid place-content-center">
          <div className="w-1 h-24 bg-[#ffffff05] rounded-xl cursor-col-resize" onMouseDown={onMouseDown} />
        </div>
        <Editor value={compiledSource} readOnly />
      </div>
    </section>
  );
};

const Editor: VFC<ReactCodeMirrorProps> = props => (
  <CodeMirror
    basicSetup={false}
    theme="dark"
    height="100%"
    extensions={[javascript({ jsx: true, typescript: true })]}
    {...props}
  />
);
