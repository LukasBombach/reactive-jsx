import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import type { VFC, FC } from "react";

type PreviewProps = Omit<JSX.IntrinsicElements["iframe"], "children"> & { code: string };

export const CodePreview: VFC<PreviewProps> = ({ code, ...props }) => {
  // const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);
  // const [script, setScript] = useState<HTMLScriptElement | null>(null);

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
  }, [iframe, code]);

  return <iframe {...props} ref={iframe} />;
};

export const Preview: VFC<PreviewProps> = ({ code, ...props }) => (
  <Iframe {...props}>
    <pre>{code}</pre>
  </Iframe>
);

const Iframe: FC<JSX.IntrinsicElements["iframe"]> = ({ children, ...props }) => {
  const [ref, setRef] = useState(null);
  const body = ref?.contentWindow.document.body;

  return (
    <iframe {...props} ref={setRef}>
      {body && createPortal(children, body)}
    </iframe>
  );
};
