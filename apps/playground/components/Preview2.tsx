import { useEffect, useRef } from "react";
import Frame from "react-frame-component";

import type { VFC } from "react";

type PreviewProps = Omit<JSX.IntrinsicElements["iframe"], "children"> & { code: string };

export const CodePreview: VFC<PreviewProps> = ({ code, ...props }) => {
  const iframe = useRef<HTMLIFrameElement | null>(null);
  const script = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    const head = iframe.current?.contentWindow.document.head;
    const body = iframe.current?.contentWindow.document.body;

    if (!head || !body) return;

    script.current?.parentNode.removeChild(script.current);

    const newScript = document.createElement("script");
    newScript.textContent = code;

    body.replaceChildren();
    head.append(newScript);

    script.current = newScript;
  }, [iframe.current, code]);

  return <Frame {...props} ref={iframe} />;
};
