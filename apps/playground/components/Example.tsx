import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { bundle } from "@reactive-jsx/bundler";
import { CodePreview } from "components/Preview";

import type { VFC } from "react";

const Playground: VFC<{ runtime: string; source: string; className?: string }> = ({
  runtime,
  source: initialSource,
  className,
}) => {
  const [source, setSource] = useState(initialSource.trim());
  const [result, setResult] = useState("");
  const [error, setError] = useState<string | null>(null);

  // todo race conditions
  useEffect(() => {
    bundle(source, runtime)
      .then(newResult => {
        setError(null);
        setResult(newResult);
      })
      .catch(error => {
        console.error(error);
        setError(error.message);
        setResult("");
      });
  }, [source, runtime]);

  return (
    <div className={`flex h-full relative bg-[#282c34] ${className}`}>
      <CodeMirror
        value={source}
        theme="dark"
        extensions={[javascript({ jsx: true })]}
        onChange={value => setSource(value)}
        height="100%"
        className="h-full overflow-y-auto w-1/2"
      />

      <CodePreview code={result} className="h-full w-1/2" />

      {error && (
        <p className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-purple-500 shadow-lg rounded-lg p-4 text-white dark:bg-sky-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default Playground;
