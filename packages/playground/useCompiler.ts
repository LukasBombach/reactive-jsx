import { useState, useEffect } from "react";
import { compile } from "./compiler";

import type { ResolveFile } from "./compiler";

export function useCompiler(
  initialSource: string,
  resolveFile: ResolveFile
): [compiledSource: string | undefined, setSource: (source: string) => void] {
  const [source, setSource] = useState(initialSource);
  const [compiledSource, setCompiledSource] = useState<string>();

  // todo race conditions
  useEffect(() => {
    compile(source, resolveFile)
      .then(setCompiledSource)
      .catch(error => console.warn(error));
  }, [source]);

  return [compiledSource, setSource];
}
