import type { AppProps } from "next/app";
import "styles/globals.scss";
import "react-tooltip/dist/react-tooltip.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
