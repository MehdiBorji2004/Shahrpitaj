import { Navigate, NavLink } from "react-router-dom";
import "./BottomNavigation.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import UseAdminData from "../../hooks/UseAdminData";
import axios from "axios";
import navItemsData from "../navbar/navItemsData";

export default function BottomNavigation() {
  const baseUrl = import.meta.env.VITE_BASE_URL || "https://api.shahrpitaj.ir";
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [role, setRole] = useState("");
  const token = localStorage.getItem("token");
  const timeoutID = useRef(null);
  const { setErrors } = UseAdminData();

  const isAdmin = useCallback(async () => {
    try {
      if (!token) return;

      const res = await axios.get(`${baseUrl}/auth/role`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        setRole(res.data.data || "");
      }
    } catch (error) {
      console.error("Error verifying navigation role:", error);
      setErrors(error.response?.data?.message || "خطا در بررسی دسترسی");
      timeoutID.current = setTimeout(() => {
        setShouldRedirect(true);
      }, 2000);
    }
  }, [baseUrl, setErrors, token]);

  const filteredNavItems = useMemo(() => {
    if (token && role === "admin") {
      return navItemsData.filter((item) => item.id !== 5 && item.id !== 6);
    }
    if (token) {
      return navItemsData.filter((item) => item.id !== 5 && item.id !== 7);
    }
    return navItemsData.filter((item) => item.id !== 6 && item.id !== 7);
  }, [role, token]);

  useEffect(() => {
    void isAdmin();
    return () => {
      if (timeoutID.current) clearTimeout(timeoutID.current);
    };
  }, [isAdmin]);

  if (shouldRedirect) {
    return <Navigate to="/" />;
  }

  return (
    <nav className="bottom-navigation" dir="rtl" aria-label="منوی موبایل">
      {filteredNavItems.map((item) => (
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
