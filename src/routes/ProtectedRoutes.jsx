import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {
  const token =
    typeof window !== "undefined" ? window.localStorage.getItem("token") : null;

  if (!token) {
    return <Navigate to={"/login"} />;
  }

  return children;
};

export default ProtectedRoutes;
