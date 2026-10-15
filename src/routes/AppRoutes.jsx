import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
const HomePage = lazy(() => import("../pages/HomePage"));
const ReservePage = lazy(() => import("../pages/ReservePage"));
const MainServicesPage = lazy(
  () => import("../pages/services-page/MainServicesPage")
);
const ServicePage = lazy(() => import("../pages/services-page/ServicePage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const VerifyCodePage = lazy(() => import("../pages/VerifyCodePage"));
import ProtectedRoutes from "./ProtectedRoutes";
const UserPanelPage = lazy(() => import("../pages/UserPanelPage"));
const AdminPanelPage = lazy(() => import("../pages/AdminPanelPage"));
import AdminRoutes from "./AdminRoutes";
import UseAdminData from "../hooks/UseAdminData";
const ContactPage = lazy(() => import("../pages/ContactPage"));
const AboutPage = lazy(() => import("../pages/AboutPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));
const MaintenancePage = lazy(() => import("../pages/MaintenancePage"));

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
        await Promise.all([getServices(), getGeneralSettingsInfo()]);
      } catch (error) {
        console.error("error in fetching data!", error);
      }
    };

    void fetchData();
  }, [getServices, getGeneralSettingsInfo]);

  return (
    <BrowserRouter>
      <Suspense fallback={<p role="status">در حال بارگذاری صفحه...</p>}>
        {role !== "admin" &&
        generalSettingsInfo.length > 0 &&
        generalSettingsInfo[0].systemInfo?.maintenanceMode ? (
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
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;
