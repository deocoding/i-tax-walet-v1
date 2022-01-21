import "../styles/globals.css";
import "../styles/tippy.css";
import "nprogress/nprogress.css";
import "tippy.js/animations/shift-toward-extreme.css";
import "tippy.js/animations/scale.css";

import { ThemeProvider } from "next-themes";
import { StoreProvider } from "../utils/Store";

import { useRouter } from "next/router";
import { useEffect } from "react";
import NProgress from "nprogress";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // NProgress.configure({ showSpinner: false });

  useEffect(() => {
    const handleRouteChange = () => {
      NProgress.start();
    };

    const handleRouteComplete = () => {
      NProgress.done();
    };

    router.events.on("routeChangeStart", handleRouteChange);
    router.events.on("routeChangeComplete", handleRouteComplete);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  });
  return (
    <ThemeProvider enableSystem={false} attribute="class">
      <StoreProvider>
        <Component {...pageProps} />
      </StoreProvider>
    </ThemeProvider>
  );
}

export default MyApp;
