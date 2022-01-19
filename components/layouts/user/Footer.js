import React from "react";

function Footer() {
  return (
    <span>
      <div className="footer">
        <span className="uppercase">© 2021 Yeti Themes</span>
        <nav className="ltr:ml-auto rtl:mr-auto">
          <a href="mailto:Yeti Themes<info@yetithemes.net>?subject=Support">
            Support
          </a>
          <span className="divider">|</span>
          <a href="#" target="_blank">
            Docs
          </a>
        </nav>
      </div>
    </span>
  );
}

export default Footer;
