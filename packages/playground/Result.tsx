import { useEffect, useState } from "react";

import type { VFC } from "react";

type ResultProps = Omit<JSX.IntrinsicElements["iframe"], "children"> & { value?: string };

export const Result: VFC<ResultProps> = ({ value = "", ...props }) => {
  const [ref, setRef] = useState<HTMLIFrameElement | null>(null);
  const [_, setDocumentReady] = useState(false);

  // we need to trigger the re-rendering of this component
  // othwerwise the contents get lost on unmount / remount
  useEffect(() => {
    if (!ref?.contentWindow) return;
    const listener = () => setDocumentReady(true);
    ref.contentWindow.addEventListener("DOMContentLoaded", listener);
    return () => ref.contentWindow?.removeEventListener("DOMContentLoaded", listener);
  });

  useEffect(() => {
    if (!ref?.contentWindow) return;
    const script = document.createElement("script");
    script.textContent = value;
    ref.contentWindow.document.body.replaceChildren(script);
  });

  return <iframe {...props} ref={setRef}></iframe>;
};
