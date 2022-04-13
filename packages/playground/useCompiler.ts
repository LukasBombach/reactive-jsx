import { useState, useEffect } from "react";
import { compile } from "./compiler";

import type { ResolveFile } from "./compiler";

const worker = new Worker(new URL("./compiler.worker.ts", import.meta.url));

worker.onmessage = function (e) {
  console.log("Message received from worker", e.data);
};

export function useCompiler(
  initialSource: string,
  resolveFile: ResolveFile
): [compiledSource: string | undefined, setSource: (source: string) => void] {
  const [source, setSource] = useState(initialSource);
  const [compiledSource, setCompiledSource] = useState<string>();

  // todo race conditions
  useEffect(() => {
    worker.postMessage(source);

    compile(source, resolveFile)
      .then(src => setCompiledSource(src.trim()))
      .catch(error => console.warn(error));
  }, [source]);

  return [compiledSource, setSource];
}
