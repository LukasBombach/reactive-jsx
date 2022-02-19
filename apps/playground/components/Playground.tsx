import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { bundle } from "@reactive-jsx/bundler";

import type { VFC } from "react";

const Playground: VFC<{ initialSource?: string }> = ({ initialSource = "" }) => {
  const [source, setSource] = useState(initialSource);
  const [result, setResult] = useState("");
  const [error, setError] = useState<string | null>(null);

  // todo race conditions
  useEffect(() => {
    bundle(source)
      .then(newResult => {
        setError(null);
        setResult(newResult);
      })
      .catch(error => {
        setError(error.message);
        setResult("");
      });
  }, [source]);

  return (
    <div className="grid grid-cols-2 h-full relative">
      <CodeMirror
        value={source}
        theme="dark"
        extensions={[javascript({ jsx: true })]}
        onChange={value => setSource(value)}
        height="100%"
      />
      <CodeMirror value={result} extensions={[javascript()]} editable={false} height="100%" />
      {error && (
        <p className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-purple-500 shadow-lg rounded-lg p-4 text-white dark:bg-sky-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default Playground;