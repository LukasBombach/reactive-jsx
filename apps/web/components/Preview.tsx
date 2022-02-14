import { useState, useEffect } from "react";

import type { VFC } from "react";

type PreviewProps = Omit<JSX.IntrinsicElements["iframe"], "children"> & { code: string };

const createScript = (code: string) => {
  const script = document.createElement("script");
  script.textContent = code;
  return script;
};

export const Preview: VFC<PreviewProps> = ({ code, ...props }) => {
  const [script, setScript] = useState<HTMLScriptElement | null>(null);
  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);
  const head = iframe?.contentWindow.document.head;
  const body = iframe?.contentWindow.document.body;

  useEffect(() => {
    if (!head || !body) return;

    const safeCode = `
      try {
        ${code};
      } catch(error) {
        document.body.innerHTML = \`<pre>\${error.message}</pre>\`;
      }
    `;

    if (!script) {
      const newScript = createScript(safeCode);
      head.append(newScript);
      setScript(newScript);
    } else if (script.textContent !== safeCode) {
      const newScript = createScript(safeCode);
      script.parentNode.removeChild(script);
      body.replaceChildren();
      head.append(newScript);
      setScript(newScript);
    }
  }, [head, body, script, code]);

  return <iframe {...props} ref={setIframe} />;
};
