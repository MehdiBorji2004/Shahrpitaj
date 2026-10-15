import { NavLink } from "react-router-dom";
import "./BottomNavigation.css";
import { filteredNavData } from "../navbar/Navbar";

export default function BottomNavigation() {
  return (
    <nav className="bottom-navigation" dir="rtl" aria-label="منوی موبایل">
      {filteredNavData.map((item) => (
        <NavLink
          key={item.id}
          to={item.path}
          end={item.path === "/"}
          className={({ isActive }) =>
            `bottom-nav-item ${isActive ? "active" : ""}`
          }
        >
          <span className="bottom-nav-icon">{item.icon}</span>
          <span className="bottom-nav-title">{item.title}</span>
        </NavLink>
      ))}
    </nav>
  );
}
