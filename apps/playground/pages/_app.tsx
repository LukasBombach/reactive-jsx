import "styles/tailwind.css";
import "styles/fonts.css";

import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <div>todo scale by 120% on desktop</div>
      <Component {...pageProps} />;
    </>
  );
}

export default MyApp;
