import { useEffect, useState } from "react";

import type { VFC } from "react";

type PreviewProps = Omit<JSX.IntrinsicElements["iframe"], "children"> & { code: string };

export const Preview: VFC<PreviewProps> = ({ code, ...props }) => {
  const [ref, setRef] = useState<HTMLIFrameElement | null>(null);
  const [documentReady, setDocumentReady] = useState(false);

  useEffect(() => {
    const listener = () => setDocumentReady(true);
    ref?.contentWindow.addEventListener("DOMContentLoaded", listener);
    return () => ref?.contentWindow.removeEventListener("DOMContentLoaded", listener);
  });

  useEffect(() => {
    if (!ref || !documentReady) return;
    const script = document.createElement("script");
    script.textContent = code;
    ref.contentWindow.document.body.replaceChildren(script);
  });

  return <iframe {...props} ref={setRef}></iframe>;
};
