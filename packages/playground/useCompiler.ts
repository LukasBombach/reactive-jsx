import { useState, useEffect, useId } from "react";
import { compile } from "./compiler";

import type { ResolveFile } from "./compiler";

let worker: Worker | undefined;

if (typeof Worker !== "undefined") {
  worker = new Worker(new URL("./compiler.worker.ts", import.meta.url));

  worker.onmessage = function (e) {
    console.log("Message received from worker", e.data);
  };
}

export function useCompiler(
  initialSource: string,
  resolveFile: ResolveFile
): [compiledSource: string | undefined, setSource: (source: string) => void] {
  const [source, setSource] = useState(initialSource);
  const [compiledSource, setCompiledSource] = useState<string>();
  const id = useId();

  // todo race conditions
  useEffect(() => {
    if (worker) {
      worker.postMessage(source);
    }

    compile(source, resolveFile)
      .then(src => setCompiledSource(src.trim()))
      .catch(error => console.warn(error));
  }, [source]);

  return [compiledSource, setSource];
}

function useWorker() {}
