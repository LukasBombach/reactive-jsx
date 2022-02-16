import { useState /* useEffect */ } from "react";
import { createPortal } from "react-dom";

import type { VFC } from "react";

type PreviewProps = Omit<JSX.IntrinsicElements["iframe"], "children"> & { code: string };

// const createScript = (code: string) => {
//   const script = document.createElement("script");
//   script.textContent = code;
//   return script;
// };

export const Preview: VFC<PreviewProps> = ({ code, ...props }) => {
  // const [script, setScript] = useState<HTMLScriptElement | null>(null);
  // const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);

  // console.log("render", { iframe, code });

  // const body = iframe?.contentWindow?.document?.body;

  // useEffect(() => {
  // if (!body) return;

  // console.log("useEffect", { iframe, code });

  // body.innerHTML = `<pre>${code}</pre>`;

  /* const safeCode = `
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
    } */
  // }, [iframe, code]);

  return (
    <Iframe>
      <pre>${code}</pre>
    </Iframe>
  );

  /* return (
    <iframe {...props} ref={setIframe}>
      {body && createPortal(() => <pre>${code}</pre>, body)}
    </iframe>
  ); */

  // return <iframe {...props} ref={setIframe} />;
};

const Iframe = ({ children, ...props }) => {
  const [ref, setRef] = useState(null);

  const body = ref?.contentWindow.document.body;

  return (
    <iframe {...props} ref={setRef}>
      {body && createPortal(children, body)}
    </iframe>
  );
};
