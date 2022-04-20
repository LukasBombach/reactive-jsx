import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { useCompiler } from "./useCompiler";
import { SplitPane } from "./SplitPane";
import { Result } from "./Result";

import type { VFC } from "react";
import type { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import type { ResolveFile } from "./compiler";

// todo optimize markup & css
// todo cleanup tab code
// todo instead of un / remounting tabs, hide / display them to keep state
// todo optimize heights (keep it) when switching tabs
export const Playground: VFC<{ source: string; resolveFile: ResolveFile }> = ({ source, resolveFile }) => {
  const [compiledSource, setSource] = useCompiler(source, resolveFile);
  const [rightPane, setRightPane] = useState<"result" | "js">("result");

  return (
    <SplitPane>
      <div>
        <div className="grid grid-cols-12 gap-4 p-6 bg-[#ffffff0a] px-6 py-3">
          <div className="col-span-7 flex gap-4">
            <span className="text-xs text-slate-200 py-1">app.js</span>
          </div>
        </div>
        <Editor className="p-6" value={source.trim()} onChange={setSource} />
      </div>
      <div>
        <div className="grid grid-cols-12 gap-4 p-6 bg-[#ffffff0a] px-6 py-3">
          <div className="col-span-5 flex gap-4">
            <button
              className={[
                "text-xs text-slate-200 py-1 cursor-pointer",
                rightPane === "result" && "border-b border-amber-400",
              ].join(" ")}
              onClick={() => setRightPane("result")}
            >
              Result
            </button>
            <button
              className={[
                "text-xs text-slate-200 py-1 cursor-pointer",
                rightPane === "js" && "border-b border-amber-400",
              ].join(" ")}
              onClick={() => setRightPane("js")}
            >
              JS Output
            </button>
          </div>
        </div>
        {rightPane === "result" ? (
          <Result className="p-6" value={compiledSource} />
        ) : rightPane === "js" ? (
          <Editor className="p-6" value={compiledSource} readOnly />
        ) : null}
      </div>
    </SplitPane>
  );
};

const Editor: VFC<ReactCodeMirrorProps> = props => (
  <CodeMirror basicSetup={false} theme="dark" height="100%" extensions={[javascript({ jsx: true })]} {...props} />
);
