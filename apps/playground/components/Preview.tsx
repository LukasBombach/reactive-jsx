import { useEffect, useRef, useState, useCallback } from "react";

import type { VFC } from "react";

type PreviewProps = Omit<JSX.IntrinsicElements["iframe"], "children"> & { code: string };

export const CodePreview: VFC<PreviewProps> = ({ code, ...props }) => {
  const ref = useRef<HTMLIFrameElement | null>(null);
  const [script, setScript] = useState<HTMLScriptElement | null>(null);

  const setRef = useCallback(
    (node: HTMLIFrameElement | undefined) => {
      if (ref.current && script) {
        script.parentNode.removeChild(script);
      }

      if (node) {
        const head = node.contentWindow.document.head;
        const body = node.contentWindow.document.body;

        const newScript = document.createElement("script");
        newScript.textContent = code;
        setScript(newScript);

        // body.replaceChildren();
        head.appendChild(newScript);
      }

      ref.current = node;
    },
    [code]
  );

  // const ref = useCallback(
  //   node => {
  //     if (ref.current) {
  //       // Make sure to cleanup any events/references added to the last instance
  //     }
  //
  //
  //     /* if (!iframe) return;
  //     if (code === script?.textContent) return;
  //
  //     const newScript = document.createElement("script");
  //     newScript.textContent = code;
  //     setScript(newScript);
  //
  //     const body = iframe.contentWindow.document.body;
  //     body.replaceChildren(newScript); */
  //   },
  //   [code]
  // );

  console.log("rerender", ref.current?.contentWindow.document.head.children);

  return <iframe {...props} ref={setRef} />;
};
