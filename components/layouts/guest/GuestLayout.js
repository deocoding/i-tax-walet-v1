import Head from "next/head";
import React from "react";
import TopBar from "./TopBar";

function GuestLayout({ title, description, children }) {
  return (
    <div className="min-h-screen flex relative">
      <Head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>{title ? `Taxbird - ${title}` : "Taxbird"}</title>
        {description && <meta name="description" content={description}></meta>}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <TopBar title={title} />
      <div className="container flex items-center justify-center mt-20 py-10">
        {children}
      </div>
    </div>
  );
}

export default GuestLayout;
