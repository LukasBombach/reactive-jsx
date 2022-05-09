import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { useCompiler } from "./useCompiler";
import { SplitPane } from "./SplitPane";
import { Result } from "./Result";

import type { VFC, FC, ReactNode } from "react";
import type { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import type { ResolveFile } from "./compiler";

const Pane: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="grid grid-cols-1 grid-rows-[48px,1fr]">{children}</div>
);

const PaneHeader: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="grid grid-cols-12 gap-4 p-6 bg-[#ffffff0a] px-6 py-3 whitespace-nowrap">{children}</div>
);

// todo optimize markup & css
// todo cleanup tab code
// todo optimize heights (keep it) when switching tabs
export const Playground: VFC<{ source: string; resolveFile: ResolveFile; className?: string }> = ({
  source,
  resolveFile,
  className,
}) => {
  const [compiledSource, setSource] = useCompiler(source, resolveFile);
  const [rightPane, setRightPane] = useState<"result" | "js">("result");

  const resultVisible = rightPane === "result" ? "block" : "hidden";
  const jsVisible = rightPane === "js" ? "block" : "hidden";
  const resultHighlight = rightPane === "result" ? "border-b border-amber-400" : "";
  const jsHighlight = rightPane === "js" ? "border-b border-amber-400" : "";

  return (
    <SplitPane className={className}>
      <Pane>
        <PaneHeader>
          <div className="col-span-7 flex gap-4">
            <span className="text-xs text-slate-200 py-1">app.js</span>
          </div>
        </PaneHeader>
        <Editor className="p-6" value={source.trim()} onChange={setSource} />
      </Pane>
      <Pane>
        <PaneHeader>
          <div className="col-span-5 flex gap-4">
            <button
              className={["text-xs text-slate-200 py-1 cursor-pointer", resultHighlight].join(" ")}
              onClick={() => setRightPane("result")}
            >
              Result
            </button>
            <button
              className={["text-xs text-slate-200 py-1 cursor-pointer", jsHighlight].join(" ")}
              onClick={() => setRightPane("js")}
            >
              JS Output
            </button>
          </div>
        </PaneHeader>
        <Result className={["p-6 h-full w-full", resultVisible].join(" ")} value={compiledSource} />
        <Editor className={["p-6 h-full", jsVisible].join(" ")} value={compiledSource} readOnly />
      </Pane>
    </SplitPane>
  );
};

const Editor: VFC<ReactCodeMirrorProps> = props => (
  <CodeMirror basicSetup={false} theme="dark" height="100%" extensions={[javascript({ jsx: true })]} {...props} />
);
