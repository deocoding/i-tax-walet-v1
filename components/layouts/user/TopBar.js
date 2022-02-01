import Tippy from "@tippyjs/react";
import Cookies from "js-cookie";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { Store } from "../../../utils/Store";

function TopBar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const [singkatan, setSingkatan] = useState("");

  useEffect(() => {
    setMounted(true);

    const setAcronymName = (nama) => {
      const ckpDua = nama.split(" ").slice(0, 2).join(" ");
      const matches = ckpDua.match(/\b(\w)/g);
      const singNama = matches.join("");
      setSingkatan(singNama);
    };
    if (userInfo) {
      setAcronymName(userInfo.namaLengkap);
    }
    // console.log(userInfo);
  }, [userInfo]);

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

  const menuBarHandler = () => {
    const t = document.documentElement,
      o = document.querySelector(".menu-bar");
    if (!o) return;
    o.classList.contains("menu-hidden")
      ? (t.classList.remove("menu-hidden"), o.classList.remove("menu-hidden"))
      : (t.classList.add("menu-hidden"), o.classList.add("menu-hidden"));
  };

  const logoutHandler = () => {
    Cookies.remove("userInfo");
    dispatch({ type: "USER_LOGOUT" });
    router.push("/");
  };

  return (
    <header className="top-bar">
      {/* <!-- Menu Toggler --> */}
      <button
        type="button"
        className="menu-toggler las las-bars"
        onClick={menuBarHandler}
      ></button>
      {/* <!-- Brand --> */}
      <span className="brand">i-Tax Walet</span>

      <div className="flex items-center ltr:ml-auto rtl:mr-auto">
        <span className="mr-2">
          {/* <!-- Dark Mode --> */}
          {renderThemeChanger()}
        </span>

        {/* <!-- Fullscreen --> */}
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
            className="hidden lg:inline-block btn-link ltr:ml-3 rtl:mr-3 px-2 text-2xl leading-none las las-expand-arrows-alt dark:hover:text-cyan-500 hover:text-cyan-500"
            onClick={() => setFullscreenMode(this)}
          ></button>
        </Tippy>

        {/* <!-- Apps --> */}
        <div className="dropdown self-stretch">
          <Tippy
            theme="light-border tooltip"
            touch={["hold", 500]}
            interactive={!0}
            animation="scale"
            placement="bottom"
            content="Panduan"
          >
            <button
              type="button"
              className="flex items-center h-full btn-link ltr:ml-4 rtl:mr-4 lg:ltr:ml-4 lg:rtl:mr-4 px-2 text-2xl leading-none las las-book-open dark:hover:text-cyan-500 hover:text-cyan-500"
            ></button>
          </Tippy>
        </div>

        {/* <!-- Notifications --> */}
        <div className="dropdown self-stretch">
          <Tippy
            theme="light-border"
            allowHTML={!0}
            zIndex={25}
            offset={[0, 8]}
            arrow={!0}
            placement="bottom-start"
            interactive={!0}
            animation="shift-toward-extreme"
            content={
              <span>
                <div className="flex items-center px-5 py-2">
                  <h5 className="mb-0 uppercase">Notifikasi</h5>
                  {/* Components BtnOutlinedWarning */}
                  <button className="btn btn_outlined btn_warning uppercase ltr:ml-auto rtl:mr-auto text-white">
                    Lihat semua
                  </button>
                </div>
                <hr className="dark:border dark:border-color-netral-900" />
                <div className="p-5 hover:bg-primary-100 dark:hover:bg-primary-900">
                  <a href="#">
                    <h6 className="uppercase">Heading One</h6>
                  </a>
                  <p>Lorem ipsum dolor, sit amet consectetur.</p>
                  <small>Today</small>
                </div>
                <hr className="dark:border-color-netral-900" />
                <div className="p-5 hover:bg-primary-100 dark:hover:bg-primary-900">
                  <a href="#">
                    <h6 className="uppercase">Heading Two</h6>
                  </a>
                  <p>Mollitia sequi dolor architecto aut deserunt.</p>
                  <small>Yesterday</small>
                </div>
                <hr className="dark:border-color-netral-900" />
                <div className="p-5 hover:bg-primary-100 dark:hover:bg-primary-900">
                  <a href="#">
                    <h6 className="uppercase">Heading Three</h6>
                  </a>
                  <p>Nobis reprehenderit sed quos deserunt</p>
                  <small>Last Week</small>
                </div>
              </span>
            }
          >
            <button
              type="button"
              className="relative flex items-center h-full btn-link ltr:ml-4 rtl:mr-4 px-2 text-2xl leading-none las las-bell "
            >
              <span className="absolute top-0 right-0 rounded-full border border-primary -mt-1 -mr-1 px-2 leading-tight text-xs font-body text-primary">
                3
              </span>
            </button>
          </Tippy>
        </div>

        {/* <!-- User Menu --> */}
        <div className="dropdown">
          <Tippy
            theme="light-border"
            allowHTML={!0}
            zIndex={25}
            offset={[0, 8]}
            arrow={!0}
            placement="bottom-start"
            interactive={!0}
            animation="shift-toward-extreme"
            content={
              <span>
                <div className="w-64">
                  <div className="p-5">
                    <h5 className="uppercase">
                      {userInfo && userInfo.namaLengkap}
                    </h5>
                    <p>{userInfo && userInfo.isAdmin ? "Admin" : "User"}</p>
                  </div>
                  <hr />
                  <div className="p-5">
                    <a
                      className="flex items-center text-gray-700 dark:text-gray-500 hover:text-primary dark:hover:text-primary cursor-pointer"
                      onClick={logoutHandler}
                    >
                      <span className="las las-power-off text-2xl leading-none ltr:mr-2 rtl:ml-2"></span>
                      Logout
                    </a>
                  </div>
                </div>
              </span>
            }
          >
            <button className="flex items-center ltr:ml-4 rtl:mr-4 text-gray-700">
              <span className="avatar">
                {userInfo && userInfo.image ? (
                  <Image
                    src={userInfo.image}
                    alt=""
                    layout="fill"
                    objectFit="fit"
                    quality={30}
                  />
                ) : (
                  <span className="uppercase">{singkatan}</span>
                )}
              </span>
            </button>
          </Tippy>
        </div>
      </div>
    </header>
  );
}

export default TopBar;
