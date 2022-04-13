import { useState, useEffect, useId } from "react";

import type { ResolveFile } from "./compiler";

export function useCompiler(
  initialSource: string,
  resolveFile: ResolveFile
): [compiledSource: string | undefined, setSource: (source: string) => void] {
  const [source, setSource] = useState(initialSource);
  const [compiledSource, setCompiledSource] = useState<string>();
  const worker = useWorker();
  const id = useId();

  useEffect(() => {
    if (worker) {
      const listener = (e: MessageEvent<string>) => setCompiledSource(e.data.trim());
      worker.addEventListener("message", listener);
      worker.postMessage({ id, source });
      return () => worker.removeEventListener("message", listener);
    }
  }, [source, worker]);

  return [compiledSource, setSource];
}

let workerSingleton: Worker | undefined;

function useWorker() {
  const [worker, setWorker] = useState<Worker>();

  useEffect(() => {
    if (!worker) {
      workerSingleton = workerSingleton || new Worker(new URL("./compiler.worker.ts", import.meta.url));
      setWorker(workerSingleton);
    }
  }, [worker]);

  return worker;
}
