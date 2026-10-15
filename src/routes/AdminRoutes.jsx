import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";

const AdminRoutes = ({ children }) => {
  const baseUrl = import.meta.env.VITE_BASE_URL || "https://api.shahrpitaj.ir";
  const [role, setRole] = useState(null);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const token =
    typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
  let timeoutID = useRef(null);

  const isAdmin = useCallback(async () => {
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
      console.error("Error verifying admin access:", error);
      timeoutID.current = setTimeout(() => setShouldRedirect(true), 2000);
    }
  }, [baseUrl, token]);

  useEffect(() => {
    void isAdmin();
    return () => {
      if (timeoutID.current) clearTimeout(timeoutID.current);
    };
  }, [isAdmin]);

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
