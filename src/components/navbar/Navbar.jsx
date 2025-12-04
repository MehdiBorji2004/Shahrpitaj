import { Navigate, NavLink } from "react-router-dom";
import navItemsData from "../navbar/navItemsData.jsx";
import "./navbar.css";
import { useEffect, useRef, useState } from "react";
import ServicesItem from "./services-item/ServicesItem.jsx";
import axios from "axios";
import UseAdminData from "../../hooks/UseAdminData.jsx";
import AlertMessage from "../alert-messages/AlertMessage.jsx";

const Navbar = ({ closeMenu }) => {
  const baseUrl = `${import.meta.env.VITE_BASE_URL}${
    import.meta.env.VITE_PORT
  }`;
  const [isClicked, setIsClicked] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [role, setRole] = useState("");
  const token = localStorage.getItem("token");
  let filteredData = useRef();
  let timeoutID = useRef(null);
  const { errors, setErrors } = UseAdminData();

  const isAdmin = async () => {
    try {
      if (!token) {
        return <Navigate to={"/login"} />;
      }

      const res = await axios.get(`${baseUrl}/auth/role`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        setRole(res.data.data || "");
      }
    } catch (error) {
      timeoutID.current = setTimeout(() => {
        setShouldRedirect(true);
      }, 2000);
    }
  };

  if (token && role === "admin") {
    filteredData = navItemsData.filter((item) => {
      return item.id !== 5 && item.id !== 6;
    });
  } else if (token) {
    filteredData = navItemsData.filter((item) => {
      return item.id !== 5 && item.id !== 7;
    });
  } else {
    filteredData = navItemsData.filter((item) => {
      return item.id !== 6 && item.id !== 7;
    });
  }

  const handleClick = () => {
    setIsClicked(!isClicked);
  };

  const handleMouseEnter = () => {
    setIsClicked(true);
    if (timeoutID.current) {
      clearTimeout(timeoutID.current);
    }
  };

  const handleMouseLeave = () => {
    timeoutID.current = setTimeout(() => {
      setIsClicked(false);
    }, 400);
  };

  useEffect(() => {
    isAdmin();
    return () => {
      if (timeoutID.current) clearTimeout(timeoutID.current);
    };
  }, [timeoutID.current]);

  return (
    <>
      {filteredData.map((item, index) => {
        return (
          <li
            key={index}
            onClick={item.title === "خدمات" ? handleClick : undefined}
            onMouseEnter={item.title === "خدمات" ? handleMouseEnter : undefined}
            onMouseLeave={item.title === "خدمات" ? handleMouseLeave : undefined}
          >
            {isClicked && item.title === "خدمات" && (
              <ServicesItem setIsClicked={setIsClicked} />
            )}
            <NavLink
              to={item.path}
              className={item.cName}
              onClick={closeMenu}
              style={({ isActive }) => {
                return {
                  color: isActive
                    ? "var(--bs-color)"
                    : "var(--bs-text-gray-color)",
                };
              }}
            >
              <span className="nav-link-icon">{item.icon}</span>
              <span className="nav-link-title">{item.title}</span>
              <span
                className="nav-link-icon"
                onClick={item.title === "خدمات" ? handleClick : undefined}
              >
                {item.dropIcon}
              </span>
            </NavLink>
            {errors && <AlertMessage type={"error"} message={errors} />}
          </li>
        );
      })}
    </>
  );
};

export default Navbar;
