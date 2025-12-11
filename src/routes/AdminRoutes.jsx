import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";

const AdminRoutes = ({ children }) => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [role, setRole] = useState(null);
  const [errMessage, setErrMessage] = useState("");
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const token = localStorage.getItem("token");
  let timeoutID = useRef(null);

  const isAdmin = async () => {
    try {
      if (!token) {
        setRole("guest");
        return;
      }
      const res = await axios.get(`${baseUrl}/auth/role`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        setRole(res.data.data || "guest");
      }
    } catch (error) {
      timeoutID.current = setTimeout(() => setShouldRedirect(true), 2000);
    }
  };

  useEffect(() => {
    isAdmin();
    return () => {
      if (timeoutID.current) clearTimeout(timeoutID.current);
    };
  }, []);

  if (shouldRedirect) {
    return <Navigate to={"/"} />;
  }

  // وقتی هنوز نتیجه نیومده
  if (role === null) {
    return <p>در حال بررسی دسترسی...</p>;
  }

  if (!token || role !== "admin") {
    return <Navigate to={"/auth/my-panel"} />;
  }

  return children;
};

export default AdminRoutes;
