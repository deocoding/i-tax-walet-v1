import Head from "next/head";
import React from "react";
import Footer from "./Footer";
import MenuBar from "./MenuBar";
import TopBar from "./TopBar";

function UserLayout({ title, description, children }) {
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
      <TopBar />
      <MenuBar />
      <main className="workspace overflow-hidden">
        {children}
        <div className="mt-auto">
          <Footer />
        </div>
      </main>
    </div>
  );
}

export default UserLayout;
