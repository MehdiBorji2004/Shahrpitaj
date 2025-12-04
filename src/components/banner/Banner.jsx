import ReserveBtn from "../reserve-btn/ReserveBtn";
import "./banner.css";
import "./banner-responsive.css";
import Features from "../features/Features";
import BannerFeaturesData from "./BannerFeaturesData";
import UseAdminData from "../../hooks/UseAdminData";
import { useEffect } from "react";

const Banner = () => {
  const featuresData = BannerFeaturesData;
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
    <div className="banner-container">
      <div className="color-overlay"></div>

      <div className="row banner-row container-xl">
        <div className="col-xl-8 banner-text-container">
          <p className="banner-text">این صندلی شروع زیبایی شماست</p>
          <h1 className="banner-title">
            آرایشگاه مردانه {data?.baseInfo?.siteName || "شهر پیتاژ"}{" "}
          </h1>
          <p className="banner-subtitle">
            {data?.baseInfo?.siteDescription ||
              "با بیش از یک دهه تجربه، بهترین خدمات آرایشی و زیبایی را به شما ارائه می‌دهیم."}
          </p>

          <div className="row banner-address">
            <div className="col-3 px-0 address-btn">
              <ReserveBtn />
            </div>
            <div className="col-9 px-0 address-text">
              {data?.contactInfo?.address || "شهرستان اهر، آرایشگاه شهر پیتاژ"}
            </div>
          </div>

          <div className="row banner-features">
            <Features data={featuresData} />
          </div>
        </div>
        <div className="col-xl-4 banner-img-container">
          <img src="/images/banner-img2.jpg" alt="img" />
        </div>
      </div>
    </div>
  );
};

export default Banner;
