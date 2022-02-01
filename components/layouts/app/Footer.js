import React from "react";

function Footer() {
  return (
    <span>
      <div className="footer">
        <span className="uppercase">© 2022 PT. WUYUNG WURA</span>
        <nav className="ltr:ml-auto rtl:mr-auto">
          <a href="mailto:Deocoding<deocoding@gmail.com>?subject=Support">
            Bantuan
          </a>
          <span className="divider">|</span>
          <a href="#" target="_blank">
            Dokumentasi
          </a>
        </nav>
      </div>
    </span>
  );
}

export default Footer;
