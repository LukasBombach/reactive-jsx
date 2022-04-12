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
      <Editor source={source} onChange={setSource} />
      <Editor source={compiledSource} />
    </div>
  );
};

export const Editor: VFC<ReactCodeMirrorProps> = props => (
  <CodeMirror theme="dark" extensions={[javascript({ jsx: true, typescript: true })]} {...props} />
);
