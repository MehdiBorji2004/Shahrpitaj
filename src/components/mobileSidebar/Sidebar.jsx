import { useState } from "react";
import * as HiIcons from "react-icons/hi2";
import * as IoIcons from "react-icons/io";
import Navbar from "../navbar/Navbar";
import "./sidebar.css";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div className={isSidebarOpen ? "" : "header-mobile-menu"}>
        <HiIcons.HiBars3 onClick={toggleSidebar} />
      </div>
      <div
        className={isSidebarOpen ? "body-effect" : ""}
        onClick={toggleSidebar}
      ></div>
      <div className={isSidebarOpen ? "menu-sidebar" : "hide-sidebar"}>
        <div className="sidebar-cole-btn">
          <IoIcons.IoMdClose onClick={toggleSidebar} />
        </div>
        <ul className="menu-sidebar-list">
          <Navbar closeMenu={toggleSidebar} />
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
