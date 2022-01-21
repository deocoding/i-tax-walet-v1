import React from "react";

function Footer() {
  return (
    <span>
      <div className="footer">
        <span className="uppercase">© 2021 PT. WUYUNG WURA</span>
        <nav className="ltr:ml-auto rtl:mr-auto">
          <a href="mailto:Taxbird <deocoding@gmail.com>?subject=Support">
            Hubungi Kami
          </a>
          <span className="divider">|</span>
          <a href="#" target="_blank">
            Panduan
          </a>
        </nav>
      </div>
    </span>
  );
}

export default Footer;
