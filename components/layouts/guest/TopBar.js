import Tippy from "@tippyjs/react";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";

function TopBar({ title }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [aksi, setAksi] = useState({});

  useEffect(() => {
    if (title === "Register") {
      setAksi({
        jdlAksi: "Login",
        linkAksi: "/",
      });
    } else {
      setAksi({
        jdlAksi: "Register",
        linkAksi: "/register",
      });
    }
    setMounted(true);
  }, [title]);

  // console.log(aksi.jdlAksi);

  const renderThemeChanger = () => {
    if (!mounted) return null;
    const currentTheme = theme;

    if (currentTheme === "dark") {
      return (
        <Tippy
          theme="light-border tooltip"
          touch={["hold", 500]}
          interactive={!0}
          animation="scale"
          placement="bottom"
          content="Toggle Light Mode"
        >
          <button
            className="relative inline-flex items-center py-1.5 px-2 rounded-full transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus:outline-none bg-gray-700 text-gray-400 focus-visible:ring-gray-500"
            id="headlessui-switch-48"
            role="switch"
            type="button"
            tabIndex="0"
            aria-checked="true"
            onClick={() => setTheme("light")}
          >
            <span className="sr-only">Enable dark mode</span>
            <svg
              width="24"
              height="24"
              fill="none"
              aria-hidden="true"
              className="transform transition-transform scale-100 duration-300"
            >
              <path
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M12 4v1M18 6l-1 1M20 12h-1M18 18l-1-1M12 19v1M7 17l-1 1M5 12H4M7 7 6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
            <svg
              width="24"
              height="24"
              fill="none"
              aria-hidden="true"
              className="ml-3.5 transform transition-transform scale-0 duration-500"
            >
              <path
                d="M18 15.63c-.977.52-1.945.481-3.13.481A6.981 6.981 0 0 1 7.89 9.13c0-1.185-.04-2.153.481-3.13C6.166 7.174 5 9.347 5 12.018A6.981 6.981 0 0 0 11.982 19c2.67 0 4.844-1.166 6.018-3.37ZM16 5c0 2.08-.96 4-3 4 2.04 0 3 .92 3 3 0-2.08.96-3 3-3-2.04 0-3-1.92-3-4Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
            <span className="absolute top-0.5 left-0.5 bg-white w-8 h-8 rounded-full flex items-center justify-center transition duration-500 transform translate-x-[2.625rem]">
              <svg
                width="24"
                height="24"
                fill="none"
                aria-hidden="true"
                className="flex-none transition duration-500 transform text-cyan-500 opacity-0 scale-0"
              >
                <path
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M12 4v1M18 6l-1 1M20 12h-1M18 18l-1-1M12 19v1M7 17l-1 1M5 12H4M7 7 6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
              <svg
                width="24"
                height="24"
                fill="none"
                aria-hidden="true"
                className="flex-none -ml-6 transition duration-500 transform text-gray-700 opacity-100 scale-100"
              >
                <path
                  d="M18 15.63c-.977.52-1.945.481-3.13.481A6.981 6.981 0 0 1 7.89 9.13c0-1.185-.04-2.153.481-3.13C6.166 7.174 5 9.347 5 12.018A6.981 6.981 0 0 0 11.982 19c2.67 0 4.844-1.166 6.018-3.37ZM16 5c0 2.08-.96 4-3 4 2.04 0 3 .92 3 3 0-2.08.96-3 3-3-2.04 0-3-1.92-3-4Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </span>
          </button>
        </Tippy>
      );
    } else {
      return (
        <Tippy
          theme="light-border tooltip"
          touch={["hold", 500]}
          interactive={!0}
          animation="scale"
          placement="bottom"
          content="Toggle Dark Mode"
        >
          <button
            className="relative inline-flex items-center py-1.5 px-2 rounded-full transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-offset-2  focus-visible:ring-offset-white focus:outline-none bg-cyan-500 text-cyan-200 focus-visible:ring-cyan-600"
            id="headlessui-switch-48"
            role="switch"
            type="button"
            tabIndex="0"
            aria-checked="false"
            onClick={() => setTheme("dark")}
          >
            <span className="sr-only">Disable dark mode</span>
            <svg
              width="24"
              height="24"
              fill="none"
              aria-hidden="true"
              className="transform transition-transform scale-0 duration-500"
            >
              <path
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M12 4v1M18 6l-1 1M20 12h-1M18 18l-1-1M12 19v1M7 17l-1 1M5 12H4M7 7 6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
            <svg
              width="24"
              height="24"
              fill="none"
              aria-hidden="true"
              className="ml-3.5 transform transition-transform scale-100 duration-300"
            >
              <path
                d="M18 15.63c-.977.52-1.945.481-3.13.481A6.981 6.981 0 0 1 7.89 9.13c0-1.185-.04-2.153.481-3.13C6.166 7.174 5 9.347 5 12.018A6.981 6.981 0 0 0 11.982 19c2.67 0 4.844-1.166 6.018-3.37ZM16 5c0 2.08-.96 4-3 4 2.04 0 3 .92 3 3 0-2.08.96-3 3-3-2.04 0-3-1.92-3-4Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
            <span className="absolute top-0.5 left-0.5 bg-white w-8 h-8 rounded-full flex items-center justify-center transition duration-500 transform">
              <svg
                width="24"
                height="24"
                fill="none"
                aria-hidden="true"
                className="flex-none transition duration-500 transform text-cyan-500 opacity-100 scale-100"
              >
                <path
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M12 4v1M18 6l-1 1M20 12h-1M18 18l-1-1M12 19v1M7 17l-1 1M5 12H4M7 7 6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
              <svg
                width="24"
                height="24"
                fill="none"
                aria-hidden="true"
                className="flex-none -ml-6 transition duration-500 transform text-gray-700 opacity-0 scale-0"
              >
                <path
                  d="M18 15.63c-.977.52-1.945.481-3.13.481A6.981 6.981 0 0 1 7.89 9.13c0-1.185-.04-2.153.481-3.13C6.166 7.174 5 9.347 5 12.018A6.981 6.981 0 0 0 11.982 19c2.67 0 4.844-1.166 6.018-3.37ZM16 5c0 2.08-.96 4-3 4 2.04 0 3 .92 3 3 0-2.08.96-3 3-3-2.04 0-3-1.92-3-4Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </span>
          </button>
        </Tippy>
      );
    }
  };

  const setFullscreenMode = () => {
    const t = document.getElementById("fullScreenToggler");
    if (!t) return;
    const e = document.documentElement;
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
      ? document.exitFullscreen
        ? document.exitFullscreen()
        : document.mozCancelFullScreen
        ? document.mozCancelFullScreen()
        : document.webkitExitFullscreen
        ? document.webkitExitFullscreen()
        : document.msExitFullscreen && document.msExitFullscreen()
      : e.requestFullscreen
      ? e.requestFullscreen()
      : e.mozRequestFullScreen
      ? e.mozRequestFullScreen()
      : e.webkitRequestFullscreen
      ? e.webkitRequestFullscreen()
      : e.msRequestFullscreen && e.msRequestFullscreen(),
      t.classList.contains("las-expand-arrows-alt")
        ? (t.classList.remove("las-expand-arrows-alt"),
          t.classList.add("las-compress-arrows-alt"))
        : (t.classList.remove("las-compress-arrows-alt"),
          t.classList.add("las-expand-arrows-alt"));
  };

  // const CapitalizeStr = (str) => {
  //   return str.charAt(0).toUpperCase() + str.slice(1);
  // };

  return (
    <section className="top-bar">
      {/* <!-- Brand --> */}
      <span className="brand">Taxbird</span>

      <nav className="flex items-center ltr:ml-auto rtl:mr-auto">
        {/* <!-- Dark Mode --> */}
        {renderThemeChanger()}
        {/* <label
          className="switch switch_outlined"
          data-toggle="tooltip"
          data-tippy-content="Toggle Dark Mode"
          aria-expanded="false"
        >
          <input id="darkModeToggler" type="checkbox" />
          <span></span>
        </label> */}

        {/* <!-- Fullscreen --> */}
        <>
          <Tippy
            theme="light-border tooltip"
            touch={["hold", 500]}
            interactive={!0}
            animation="scale"
            placement="bottom"
            content="Fullscreen"
          >
            <button
              id="fullScreenToggler"
              type="button"
              className="lg:inline-block btn-link ltr:ml-3 rtl:mr-3 px-2 text-2xl leading-none las las-expand-arrows-alt dark:hover:text-cyan-500 hover:text-cyan-500"
              onClick={() => setFullscreenMode(this)}
            ></button>
          </Tippy>
        </>

        {/* <!-- Register --> */}
        <a
          href={aksi.linkAksi}
          className="btn btn_primary uppercase ltr:ml-5 rtl:mr-5"
        >
          {aksi.jdlAksi}
        </a>
      </nav>
    </section>
  );
}

export default TopBar;
