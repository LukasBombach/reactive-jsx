import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Preview } from "components/Preview";

import type { VFC } from "react";

export const Playground: VFC<{ code?: string }> = ({ code: initialCode = "" }) => {
  const [code, setCode] = useState(initialCode);

  return (
    <div className="grid grid-cols-2 h-full">
      <Editor defaultLanguage="typescript" defaultValue={code} onChange={v => setCode(v)} />
      <Preview className="w-full" code={code} />
    </div>
  );
};
