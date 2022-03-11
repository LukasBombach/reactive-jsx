import { useEffect, useRef, useState, useCallback } from "react";
import Frame from "react-frame-component";

import type { VFC } from "react";

type PreviewProps = Omit<JSX.IntrinsicElements["iframe"], "children"> & { code: string };

export const Preview: VFC<PreviewProps> = ({ code, ...props }) => {
  const [script, setScript] = useState<HTMLScriptElement | null>(null);
  const [scriptsRef, setScriptsRef] = useState<HTMLDivElement | null>(null);
  // const scriptsRef = useRef<HTMLDivElement | null>(null);
  const appRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!scriptsRef) return;

    script?.parentNode.removeChild(script);
    appRef.current?.replaceChildren();

    const newScript = document.createElement("script");
    newScript.textContent = code;

    scriptsRef.append(newScript);
    setScript(newScript);
  }, [scriptsRef, code]);

  return (
    <Frame {...props}>
      <div ref={setScriptsRef} />
      <div ref={appRef} id="app" />
    </Frame>
  );
};
