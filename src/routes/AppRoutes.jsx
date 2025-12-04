import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ReservePage from "../pages/ReservePage";
import MainServicesPage from "../pages/services-page/MainServicesPage";
import ServicePage from "../pages/services-page/ServicePage";
import RegisterPage from "../pages/RegisterPage";
import VerifyCodePage from "../pages/VerifyCodePage";
import ProtectedRoutes from "./ProtectedRoutes";
import UserPanelPage from "../pages/UserPanelPage";
import AdminPanelPage from "../pages/AdminPanelPage";
import AdminRoutes from "./AdminRoutes";
import UseAdminData from "../hooks/UseAdminData";
import { useEffect, useState } from "react";
import ContactPage from "../pages/ContactPage";
import AboutPage from "../pages/AboutPage";
import NotFoundPage from "../pages/NotFoundPage";
import MaintenancePage from "../pages/MaintenancePage";

const AppRoutes = () => {
  const {
    getServices,
    getGeneralSettingsInfo,
    servicesList,
    generalSettingsInfo,
    role,
  } = UseAdminData();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getServices();
        await getGeneralSettingsInfo();
      } catch (error) {
        throw new Error("error in fetching data!", error);
      }
    };

    fetchData();
  }, []);

  return (
    <BrowserRouter>
      {role !== "admin" &&
      generalSettingsInfo.length > 0 &&
      generalSettingsInfo[0].systemInfo.maintenanceMode ? (
        <MaintenancePage />
      ) : (
        <Routes>
          <Route path="/home" element={<Navigate to="/" />} />
          <Route path="/" element={<HomePage />} />
          <Route
            path="/reserve"
            element={
              <ProtectedRoutes>
                <ReservePage />
              </ProtectedRoutes>
            }
          />

          <Route path="/services" element={<MainServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />

          {servicesList &&
            servicesList.map((service, index) => {
              return (
                <Route
                  key={index}
                  path={service.servicePath}
                  element={<ServicePage url={service.servicePath} />}
                />
              );
            })}

          <Route path="/signup" element={<RegisterPage type={"signup"} />} />
          <Route
            path="/verify-signup"
            element={<VerifyCodePage type={"verify-signup"} />}
          />
          <Route path="/login" element={<RegisterPage type={"login"} />} />
          <Route
            path="/verify-login"
            element={<VerifyCodePage type={"verify-login"} />}
          />
          <Route
            path="/auth/my-panel"
            element={
              <ProtectedRoutes>
                <UserPanelPage />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/admin/panel"
            element={
              <AdminRoutes>
                <AdminPanelPage />
              </AdminRoutes>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      )}
    </BrowserRouter>
  );
};

export default AppRoutes;
