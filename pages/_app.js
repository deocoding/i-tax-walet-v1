import "../styles/globals.css";
import "../styles/tippy.css";
import "../styles/skeleton.css";
import "nprogress/nprogress.css";
import "tippy.js/animations/shift-toward-extreme.css";
import "tippy.js/animations/scale.css";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-datepicker/dist/react-datepicker.css";
import "pure-react-carousel/dist/react-carousel.es.css";

import { ThemeProvider } from "next-themes";
import { StoreProvider } from "../utils/Store";

import { useRouter } from "next/router";
import { useEffect } from "react";
import NProgress from "nprogress";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // NProgress.configure({ showSpinner: false });

  useEffect(() => {
    const handleRouteChange = (url) => {
      NProgress.start();
    };

    const handleRouteComplete = (url) => {
      NProgress.done();
    };

    router.events.on("routeChangeStart", handleRouteChange);
    router.events.on("routeChangeComplete", handleRouteComplete);
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
