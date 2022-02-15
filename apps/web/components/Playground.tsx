import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { bundle } from "bundler";
import { Preview } from "components/Preview";

import type { VFC } from "react";

const Playground: VFC<{ initialSource?: string }> = ({ initialSource = "" }) => {
  const [source, setSource] = useState(initialSource);
  const [result, setResult] = useState<string>("");

  // todo race conditions
  useEffect(() => {
    bundle(source)
      .then(newResult => {
        // console.log(newResult);
        setResult(newResult);
      })
      .catch(error => console.error(error.message));
  }, [source]);

  return (
    <div className="grid grid-cols-2 h-full">
      <Editor defaultLanguage="typescript" defaultValue={source} onChange={v => setSource(v)} />
      <Preview className="w-full" code={result} />
    </div>
  );
};

export default Playground;
