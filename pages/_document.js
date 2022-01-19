import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en" dir="ltr" className="menu-hidden">
        <Head>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,700|Nunito:400,700&display=swap"
          />
          <link
            rel="stylesheet"
            href="https://unpkg.com/@icon/line-awesome/line-awesome.css"
          ></link>
        </Head>
        <body className="bg-[#f8f8f8] text-sm leading-5 text-[#555555] dark:bg-[#151515] dark:text-[#aaaaaa]">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
