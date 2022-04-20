import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { useCompiler } from "./useCompiler";
import { SplitPane } from "./SplitPane";
import { Result } from "./Result";

import type { VFC } from "react";
import type { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import type { ResolveFile } from "./compiler";

// todo optimize markup & css
export const Playground: VFC<{ source: string; resolveFile: ResolveFile }> = ({ source, resolveFile }) => {
  const [compiledSource, setSource] = useCompiler(source, resolveFile);

  return (
    <SplitPane>
      <div>
        <div className="grid grid-cols-12 gap-4 p-6 bg-[#ffffff0a] px-6 py-3">
          <div className="col-span-7 flex gap-4">
            <span className="text-xs text-slate-200 py-1">app.js</span>
          </div>
        </div>
        <Editor className="p-6" value={source} onChange={setSource} />
      </div>
      <div>
        <div className="grid grid-cols-12 gap-4 p-6 bg-[#ffffff0a] px-6 py-3">
          <div className="col-span-5 flex gap-4">
            <button className="text-xs text-slate-200 py-1 cursor-pointer">Result</button>
            <button className="text-xs text-slate-200 py-1 border-b border-amber-400 cursor-pointer">JS Output</button>
          </div>
        </div>
        <Result value={compiledSource} />
        {/* <Editor className="p-6" value={compiledSource} readOnly /> */}
      </div>
    </SplitPane>
  );
};

const Editor: VFC<ReactCodeMirrorProps> = props => (
  <CodeMirror basicSetup={false} theme="dark" height="100%" extensions={[javascript({ jsx: true })]} {...props} />
);
