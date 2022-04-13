import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { useCompiler } from "./useCompiler";

import type { VFC } from "react";
import type { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import type { ResolveFile } from "./compiler";

export const Playground: VFC<{ source: string; resolveFile: ResolveFile }> = ({ source, resolveFile }) => {
  const [compiledSource, setSource] = useCompiler(source, resolveFile);

  return (
    <div className="grid grid-cols-12 gap-4 bg-[#282c34] rounded-xl p-6 overflow-hidden">
      <Editor value={source} onChange={setSource} className="col-span-7" />
      <Editor value={compiledSource} readOnly className="col-span-5" />
    </div>
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
