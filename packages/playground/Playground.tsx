import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { useCompiler } from "./useCompiler";

import type { VFC } from "react";
import type { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import type { ResolveFile } from "./compiler";

export const Playground: VFC<{ source: string; resolveFile: ResolveFile }> = ({ source, resolveFile }) => {
  const [compiledSource, setSource] = useCompiler(source, resolveFile);

  return (
    <div className="grid grid-cols-2 gap-2 bg-[#282c34]">
      <Editor value={source} onChange={setSource} />
      <Editor value={compiledSource} readOnly />
    </div>
  );
};

export const Editor: VFC<ReactCodeMirrorProps> = props => (
  <CodeMirror theme="dark" height="100%" extensions={[javascript({ jsx: true, typescript: true })]} {...props} />
);
