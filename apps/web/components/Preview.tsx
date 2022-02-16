import { useState } from "react";
import { createPortal } from "react-dom";

import type { VFC, FC } from "react";

type PreviewProps = Omit<JSX.IntrinsicElements["iframe"], "children"> & { code: string };

export const Preview: VFC<PreviewProps> = ({ code, ...props }) => (
  <Iframe {...props}>
    <pre>${code}</pre>
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
