import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { bundle } from "@reactive-jsx/bundler";
import { Preview } from "components/Preview";

import type { VFC } from "react";

interface ExampleProps {
  runtime: string;
  source: string;
  className?: string;
}

function useCompiler(initialSource: string, runtime: string) {
  const [source, setSource] = useState(initialSource.trim());
  const [result, setResult] = useState("");
  const [error, setError] = useState<string>();

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

  return [error, result, setSource] as const;
}

const Example: VFC<ExampleProps> = ({ runtime, source, className }) => {
  const [error, result, setSource] = useCompiler(source, runtime);

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

      <Preview code={result} className="h-full w-1/2" />

      {error && (
        <p className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-purple-500 shadow-lg rounded-lg p-4 text-white dark:bg-sky-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default Example;
