import { useEffect, useState } from "react";

import type { VFC } from "react";

type ResultProps = Omit<JSX.IntrinsicElements["iframe"], "children"> & { value?: string };

export const Result: VFC<ResultProps> = ({ value = "", ...props }) => {
  const [ref, setRef] = useState<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (!ref?.contentWindow) return;
    const script = document.createElement("script");
    script.textContent = value;
    ref.contentWindow.document.body.replaceChildren(script);
  });

  return <iframe {...props} ref={setRef}></iframe>;
};
