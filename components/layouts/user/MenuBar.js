import Tippy from "@tippyjs/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function MenuBar({ title }) {
  const [mounted, setMounted] = useState(false);
  // const [viewportWidth, setViewportWidth] = useState(false);

  useEffect(() => {
    let viewportWidth;
    const setViewportWidth = () => {
        viewportWidth =
          window.innerWidth || document.documentElement.clientWidth;
      },
      watchWidth = () => {
        const t = document.querySelector(".menu-bar");
        if (viewportWidth < 640) {
          if (!t) return;
          t.querySelector(".menu-detail.open") ||
            (t.classList.add("menu-hidden"),
            document.documentElement.classList.add("menu-hidden"),
            t.querySelectorAll(".menu-detail.open").forEach((e) => {
              hideOverlay(),
                t.classList.contains("menu-wide") || e.classList.remove("open");
            }));
        }
        if (viewportWidth > 640) {
          if (!t) return;
          t.classList.remove("menu-hidden"),
            document.documentElement.classList.remove("menu-hidden");
        }
        viewportWidth > 1024 &&
          (() => {
            const t = document.querySelector(".sidebar");
            t &&
              t.classList.contains("open") &&
              (t.classList.remove("open"), hideOverlay());
          })();
      };
    setViewportWidth(),
      watchWidth(),
      window.addEventListener(
        "resize",
        () => {
          setViewportWidth(), watchWidth();
        },
        !1
      );

    setMounted(true);
  }, []);

  return (
    <aside className="menu-bar menu-sticky menu-hidden">
      <div className="menu-items">
        <div className="menu-header hidden">
          <a href="#" className="flex items-center mx-8 mt-8">
            <span className="avatar w-16 h-16">JD</span>
            <div className="ltr:ml-4 rtl:mr-4 ltr:text-left rtl:text-right text-gray-700 dark:text-gray-500">
              <h5>John Doe</h5>
              <p className="mt-2">Editor</p>
            </div>
          </a>
          <hr className="mx-8 my-4" />
        </div>
        <Link href="/user/dashboard" passHref>
          <a
            className={title === "Dashboard" ? "link active" : "link"}
            data-toggle="tooltip-menu"
            data-tippy-content="Dashboard"
          >
            <span className="icon las las-laptop"></span>
            <span className="title">Dashboard</span>
          </a>
        </Link>
        <Link href="/user/detail" passHref>
          <a
            href="#no-link"
            className={title === "User Detail" ? "link active" : "link"}
            data-target="[data-menu=pages]"
            data-toggle="tooltip-menu"
            data-tippy-content="Pages"
          >
            <span className="icon las las-user"></span>
            <span className="title">User</span>
          </a>
        </Link>
        <Link href="/user/bangunan" passHref>
          <a
            href="#no-link"
            className={title === "Bangunan" ? "link active" : "link"}
            data-target="[data-menu=applications]"
            data-toggle="tooltip-menu"
            data-tippy-content="Applications"
          >
            <span className="icon las las-city"></span>
            <span className="title">Bangunan</span>
          </a>
        </Link>
        <a
          href="#no-link"
          className="link"
          data-target="[data-menu=ui]"
          data-toggle="tooltip-menu"
          data-tippy-content="UI"
        >
          <span className="icon las las-file-invoice"></span>
          <span className="title">Pajak</span>
        </a>
      </div>
    </aside>
  );
}

export default MenuBar;
