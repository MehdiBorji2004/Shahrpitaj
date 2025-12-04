import { Link } from "react-router-dom";
import "./site-logo.css";
import UseAdminData from "../../hooks/UseAdminData";
import { useEffect } from "react";

const SiteLogo = () => {
  const { getGeneralSettingsInfo, generalSettingsInfo } = UseAdminData();
  const data = generalSettingsInfo[0];

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getGeneralSettingsInfo();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="site-logo">
      <Link to="/" className="site-logo-link">
        <img
          src="/images/site-logo/site-logo2.png"
          alt="Logo"
          className="site-logo-img"
        />
        <div className="site-logo-text">
          <p className="site-logo-title">
            آرایشگاه مردانه {data?.baseInfo?.siteName || "شهر پیتاژ"}{" "}
          </p>
          <p className="site-logo-subtitle">هنر ما در زیبایی شماست</p>
        </div>
      </Link>
    </div>
  );
};

export default SiteLogo;
