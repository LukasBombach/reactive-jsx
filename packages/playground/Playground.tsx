import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { useCompiler } from "./useCompiler";

import type { VFC } from "react";
import type { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import type { ResolveFile } from "./compiler";

export const Playground: VFC<{ source: string; resolveFile: ResolveFile }> = ({ source, resolveFile }) => {
  const [compiledSource, setSource] = useCompiler(source, resolveFile);

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
      <div className="grid grid-cols-12 gap-4 p-6">
        <Editor value={source} onChange={setSource} className="col-span-7" />
        <Editor value={compiledSource} readOnly className="col-span-5" />
      </div>
    </section>
  );
};

export const Editor: VFC<ReactCodeMirrorProps> = props => (
  <CodeMirror
    basicSetup={false}
    theme="dark"
    height="100%"
    extensions={[javascript({ jsx: true, typescript: true })]}
    {...props}
  />
);
