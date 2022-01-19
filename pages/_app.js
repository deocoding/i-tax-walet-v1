import "../styles/globals.css";
import "../styles/tippy.css";
import "tippy.js/animations/shift-toward-extreme.css";
import "tippy.js/animations/scale.css";

import { ThemeProvider } from "next-themes";
import { StoreProvider } from "../utils/Store";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider enableSystem={false} attribute="class">
      <StoreProvider>
        <Component {...pageProps} />
      </StoreProvider>
    </ThemeProvider>
  );
}

export default MyApp;
