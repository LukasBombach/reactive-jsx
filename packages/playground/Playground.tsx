import { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { compile } from "./compiler";

import type { VFC } from "react";
import type { ResolveFile } from "./compiler";

function useCompiler(
  initialSource: string,
  resolveFile: ResolveFile
): [compiledSource: string | undefined, setSource: (source: string) => void] {
  const [source, setSource] = useState(initialSource);
  const [compiledSource, setCompiledSource] = useState<string>();

  // todo race conditions
  useEffect(() => {
    compile(source, resolveFile).then(setCompiledSource);
  }, [source]);

  return [compiledSource, setSource];
}

export const Playground: VFC<{ source: string; resolveFile: ResolveFile }> = ({ source, resolveFile }) => {
  const [compiledSource, setSource] = useCompiler(source, resolveFile);

  return (
    <div className="grid grid-cols-2 gap-2">
      <Editor source={source} />
      <Editor source={compiledSource} />
    </div>
  );
};

export const Editor: VFC<{ source?: string; className?: string }> = ({ source, className }) => (
  <CodeMirror value={source} theme="dark" extensions={[javascript({ jsx: true })]} className={className} />
);
