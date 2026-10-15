import Navbar from "../navbar/Navbar";
import ReserveBtn from "../reserve-btn/ReserveBtn";
import "./header.css";
import "./header-responsive.css";
import SiteLogo from "../site-logo/SiteLogo";

const Header = ({ isMobileSize, isFixed }) => {
  return (
    <header className={`header ${isFixed ? "fix-header" : ""}`}>
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
