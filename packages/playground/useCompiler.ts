import { useState, useEffect } from "react";

import type { ResolveFile } from "./compiler";

export function useCompiler(
  initialSource: string,
  resolveFile: ResolveFile = () => Promise.resolve(null)
): [compiledSource: string | undefined, setSource: (source: string) => void] {
  const [source, setSource] = useState(initialSource);
  const [compiledSource, setCompiledSource] = useState<string>();
  const worker = useWorker();

  useEffect(() => {
    if (worker) {
      const listener = (e: MessageEvent<string>) => setCompiledSource(e.data);
      worker.addEventListener("message", listener);
      worker.postMessage({ source });
      return () => worker && worker.removeEventListener("message", listener);
    }
  }, [source, worker]);

  return [compiledSource, setSource];
}

function useWorker(): Worker | undefined {
  const [worker, setWorker] = useState<Worker>();
  useEffect(() => {
    if (!worker) setWorker(new Worker(new URL("./compiler.worker.ts", import.meta.url)));
  });
  return worker;
}
