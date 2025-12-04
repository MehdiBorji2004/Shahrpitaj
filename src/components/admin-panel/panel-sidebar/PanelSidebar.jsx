import { useState } from "react";
import { sidebarData } from "../adminPanelData";
import { IoMdLogOut } from "react-icons/io";
import { TbArrowBackUp } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import { CloseButton } from "react-bootstrap";

const PanelSidebar = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  setShowDashboard,
  setShowManageUsers,
  setShowManageAdmins,
  setShowManageReserves,
  setShowManageServices,
  setShowManageServicers,
  setShowManageResrveTimes,
  setShowManageComments,
  setShowGeneralSettings,
  setShowMyPanel,
}) => {
  const [activeItem, setActiveItem] = useState(0);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const handleShowContent = (e, index) => {
    setActiveItem(index);
    const liValue = e.target.innerText;
    switch (liValue) {
      case "داشبورد":
        setShowDashboard(true);
        setShowManageUsers(false);
        setShowManageAdmins(false);
        setShowManageReserves(false);
        setShowManageServices(false);
        setShowManageServicers(false);
        setShowManageResrveTimes(true);
        setShowManageResrveTimes(false);
        setShowManageComments(false);
        setShowGeneralSettings(false);
        setShowMyPanel(false);
        break;

      case "مدیریت کاربران":
        setShowManageUsers(true);
        setShowManageAdmins(false);
        setShowDashboard(false);
        setShowManageReserves(false);
        setShowManageServices(false);
        setShowManageServicers(false);
        setShowManageResrveTimes(true);
        setShowManageResrveTimes(false);
        setShowManageComments(false);
        setShowGeneralSettings(false);
        setShowMyPanel(false);
        break;

      case "مدیریت ادمین ها":
        setShowManageAdmins(true);
        setShowDashboard(false);
        setShowManageUsers(false);
        setShowManageReserves(false);
        setShowManageServices(false);
        setShowManageServicers(false);
        setShowManageResrveTimes(true);
        setShowManageResrveTimes(false);
        setShowManageComments(false);
        setShowGeneralSettings(false);
        setShowMyPanel(false);
        break;

      case "مدیریت رزرو ها":
        setShowManageReserves(true);
        setShowDashboard(false);
        setShowManageUsers(false);
        setShowManageAdmins(false);
        setShowManageServices(false);
        setShowManageServicers(false);
        setShowManageResrveTimes(true);
        setShowManageResrveTimes(false);
        setShowManageComments(false);
        setShowGeneralSettings(false);
        setShowMyPanel(false);
        break;

      case "مدیریت خدمات":
        setShowManageServices(true);
        setShowDashboard(false);
        setShowManageUsers(false);
        setShowManageAdmins(false);
        setShowManageReserves(false);
        setShowManageServicers(false);
        setShowManageResrveTimes(true);
        setShowManageResrveTimes(false);
        setShowManageComments(false);
        setShowGeneralSettings(false);
        setShowMyPanel(false);
        break;

      case "مدیریت خدمات دهنده":
        setShowManageServicers(true);
        setShowDashboard(false);
        setShowManageUsers(false);
        setShowManageAdmins(false);
        setShowManageReserves(false);
        setShowManageServices(false);
        setShowManageResrveTimes(true);
        setShowManageResrveTimes(false);
        setShowManageComments(false);
        setShowGeneralSettings(false);
        setShowMyPanel(false);
        break;

      case "مدیریت زمان های رزرو":
        setShowManageResrveTimes(true);
        setShowManageServicers(false);
        setShowDashboard(false);
        setShowManageUsers(false);
        setShowManageAdmins(false);
        setShowManageReserves(false);
        setShowManageServices(false);
        setShowManageComments(false);
        setShowGeneralSettings(false);
        setShowMyPanel(false);
        break;

      case "مدیریت کامنت ها":
        setShowManageComments(true);
        setShowManageResrveTimes(false);
        setShowManageServicers(false);
        setShowDashboard(false);
        setShowManageUsers(false);
        setShowManageAdmins(false);
        setShowManageReserves(false);
        setShowManageServices(false);
        setShowGeneralSettings(false);
        setShowMyPanel(false);
        break;

      case "تنظیمات عمومی":
        setShowGeneralSettings(true);
        setShowManageComments(false);
        setShowManageResrveTimes(false);
        setShowManageServicers(false);
        setShowDashboard(false);
        setShowManageUsers(false);
        setShowManageAdmins(false);
        setShowManageReserves(false);
        setShowManageServices(false);
        setShowMyPanel(false);
        break;

      case "پنل کاربری من":
        setShowMyPanel(true);
        setShowGeneralSettings(false);
        setShowManageComments(false);
        setShowManageResrveTimes(false);
        setShowManageServicers(false);
        setShowDashboard(false);
        setShowManageUsers(false);
        setShowManageAdmins(false);
        setShowManageReserves(false);
        setShowManageServices(false);
        break;

      default:
        setShowDashboard(true);
        break;
    }
  };

  return (
    <div
      className={isMobileMenuOpen ? "panel-sidebar-container" : ""}
      onClick={() => setIsMobileMenuOpen(false)}
    >
      <div
        className={isMobileMenuOpen ? "show-panel-sidebar" : "panel-sidebar"}
      >
        <div className="panel-sidebar-head">
          <p>
            پنل مدیریتی شهر پیتاژ{" "}
            <span>
              <img src="/images/site-logo/site-logo2.png" alt="" />
            </span>{" "}
          </p>
        </div>
        <ul className="panel-sidebar-list">
          {sidebarData.map((item, index) => (
            <li
              key={index}
              onClick={(e) => handleShowContent(e, index)}
              className={`sidebar-item ${activeItem === index ? "active" : ""}`}
            >
              {item.icon}
              {item.title}
            </li>
          ))}
          <li>
            <Link to={"/"}>
              <TbArrowBackUp />
              بازگشت به صفحه اصلی
            </Link>
          </li>
          <li onClick={handleLogout}>
            <IoMdLogOut /> خروج از حساب
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PanelSidebar;
