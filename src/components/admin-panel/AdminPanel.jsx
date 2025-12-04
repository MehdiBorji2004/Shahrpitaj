import { createContext, useEffect, useState } from "react";
import "./admin-panel.css";
import PanelSidebar from "./panel-sidebar/PanelSidebar";
import Dashboard from "./dashboard/Dashboard";
import ManageUsers from "./manage-users/ManageUsers";
import ManageAdmins from "./manage-admins/ManageAdmins";
import ManageReserves from "./manage-reserves/ManageReserves";
import ManageServices from "./manage-services/ManageServices";
import ManageServicers from "./manage-servicers/ManageServicers";
import ManageReserveTimes from "./manage-reserve-times/ManageReserveTimes";
import ManageComments from "./manage-comments/ManageComments";
import GeneralSettings from "./general-settings/GeneralSettings";
import UserPanel from "../user-panel/UserPanel";
import { HiBars3 } from "react-icons/hi2";

export const dateContext = createContext();

const AdminPanel = () => {
  const [showDashboard, setShowDashboard] = useState(true);
  const [showManageUsers, setShowManageUsers] = useState(false);
  const [showManageAdmins, setShowManageAdmins] = useState(false);
  const [showManageReserves, setShowManageReserves] = useState(false);
  const [showManageServices, setShowManageServices] = useState(false);
  const [showManageServicers, setShowManageServicers] = useState(false);
  const [showManageResrveTimes, setShowManageResrveTimes] = useState(false);
  const [showManageComments, setShowManageComments] = useState(false);
  const [showGeneralSettings, setShowGeneralSettings] = useState(false);
  const [showMyPanel, setShowMyPanel] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [convertedDate, setConvertedDate] = useState({
    startDate: "",
    endDate: "",
  });

  const contextValue = { convertedDate, setConvertedDate };

  const handleResize = () => {
    window.innerWidth <= 480 ? setMobileMenu(true) : setMobileMenu(false);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <dateContext.Provider value={contextValue}>
      <section className="admin-panel-container">
        {mobileMenu && (
          <div className={mobileMenu ? "mobile-menu" : ""}>
            <HiBars3 onClick={() => setIsMobileMenuOpen(true)} />
          </div>
        )}

        <PanelSidebar
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          setShowDashboard={setShowDashboard}
          setShowManageUsers={setShowManageUsers}
          setShowManageAdmins={setShowManageAdmins}
          setShowManageReserves={setShowManageReserves}
          setShowManageServices={setShowManageServices}
          setShowManageServicers={setShowManageServicers}
          setShowManageResrveTimes={setShowManageResrveTimes}
          setShowManageComments={setShowManageComments}
          setShowGeneralSettings={setShowGeneralSettings}
          setShowMyPanel={setShowMyPanel}
        />
        {showDashboard && <Dashboard />}
        {showManageUsers && <ManageUsers />}
        {showManageAdmins && <ManageAdmins />}
        {showManageReserves && <ManageReserves />}
        {showManageServices && <ManageServices />}
        {showManageServicers && <ManageServicers />}
        {showManageResrveTimes && <ManageReserveTimes />}
        {showManageComments && <ManageComments />}
        {showGeneralSettings && <GeneralSettings />}
        {showMyPanel && <UserPanel dataKey={"admin-panel"} />}
      </section>
    </dateContext.Provider>
  );
};

export default AdminPanel;
