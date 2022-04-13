import { useState, useEffect, useId } from "react";

import type { ResolveFile } from "./compiler";

let worker: Worker | undefined;

if (typeof Worker !== "undefined") {
  worker = worker || new Worker(new URL("./compiler.worker.ts", import.meta.url));
}

export function useCompiler(
  initialSource: string,
  resolveFile: ResolveFile
): [compiledSource: string | undefined, setSource: (source: string) => void] {
  const [source, setSource] = useState(initialSource);
  const [compiledSource, setCompiledSource] = useState<string>();
  const id = useId();

  useEffect(() => {
    if (worker) {
      const listener = (e: MessageEvent<string>) => setCompiledSource(e.data.trim());
      worker.addEventListener("message", listener);
      worker.postMessage({ id, source });
      return () => worker && worker.removeEventListener("message", listener);
    }
  }, [source, worker]);

  return [compiledSource, setSource];
}
