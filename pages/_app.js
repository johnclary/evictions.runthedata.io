import { SWRConfig } from "swr";
import "../styles/globals.scss";

function MyApp({ Component, pageProps }) {
  return (
    <SWRConfig
      value={{ revalidateOnFocus: false}}
    >
      <Component {...pageProps} />
    </SWRConfig>
  );
}

export default MyApp;
