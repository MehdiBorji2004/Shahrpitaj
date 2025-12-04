import React, { useState, useEffect, useRef } from "react";
import Navbar from "../navbar/Navbar";
import Sidebar from "../mobileSidebar/Sidebar";
import ReserveBtn from "../reserve-btn/ReserveBtn";
import "./header.css";
import "./header-responsive.css";
import SiteLogo from "../site-logo/SiteLogo";

const Header = () => {
  const [isMobileSize, setIsMobileSize] = useState(false);
  const [isFixed, setIsFixed] = useState(false);

  const handleResize = () => {
    if (window.innerWidth < 576) {
      setIsMobileSize(true);
    } else {
      setIsMobileSize(false);
    }
  };

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setIsFixed(true);
    } else {
      setIsFixed(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`header ${isFixed ? "fix-header" : ""}`}>
      {isMobileSize && <Sidebar />}
      <SiteLogo />
      {!isMobileSize && (
        <nav className="header-nav">
          <ul className="header-nav-list">
            <Navbar />
          </ul>
        </nav>
      )}
      <div className="header-reserve-box">
        <ReserveBtn />
      </div>
    </header>
  );
};
export default Header;
