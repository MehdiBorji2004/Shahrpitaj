import { useState, useEffect } from "react";
import {
  FaTools,
  FaClock,
  FaInstagram,
  FaWhatsapp,
  FaTelegram,
} from "react-icons/fa";
import "./maintenance-page.css";
import { FaPhone } from "react-icons/fa6";
import UseAdminData from "../hooks/UseAdminData";
import UseAppUtils from "../hooks/UseAppUtils";
import { Link } from "react-router-dom";

const MaintenancePage = () => {
  const { getGeneralSettingsInfo, generalSettingsInfo } = UseAdminData();
  const { getWorkTimes, reserveStartHour, reserveEndHour } = UseAppUtils();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getGeneralSettingsInfo();
        await getWorkTimes();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (generalSettingsInfo?.[0]) {
      setData(generalSettingsInfo[0]);
    }
  }, [generalSettingsInfo]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="maintenance-page">
      {/* Main Content */}
      <div className="maintenance-content">
        <div className="">
          <div className="maintenance-icon">
            <FaTools />
          </div>
          <h1 className="maintenance-title">در حال تعمیرات و بروزرسانی</h1>
          <p className="maintenance-description">
            آرایشگاه مردانه شهر پیتاژ در حال انجام تعمیرات و بروزرسانی می‌باشد.
            ما به زودی با ظاهری جدید و امکانات بهتر در خدمت شما خواهیم بود.
          </p>
        </div>
        <div>
          {/* Contact Info */}
          <div className="contact-section">
            <div className="contact-item">
              <FaClock className="contact-icon" />
              <div className="contact-info">
                <h5>ساعات کاری</h5>
                <p>
                  {reserveStartHour}:00 صبح تا {reserveEndHour}:00 شب
                </p>
              </div>
            </div>

            <div className="contact-item">
              <FaPhone className="contact-icon" />
              <div className="contact-info">
                <h5>تلفن تماس</h5>
                <p>{data && data.contactInfo.phone}</p>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="social-section">
            <h4>ما را در شبکه‌های اجتماعی دنبال کنید</h4>
            <div className="social-links">
              <Link
                to={data?.socialMediaInfo?.instagram || "#"}
                className="social-link instagram"
              >
                <FaInstagram />
              </Link>
              <Link
                to={data?.socialMediaInfo?.whatsApp || "#"}
                className="social-link whatsapp"
              >
                <FaWhatsapp />
              </Link>
              <Link
                to={data?.socialMediaInfo?.telegram || "#"}
                className="social-link telegram"
              >
                <FaTelegram />
              </Link>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="emergency-section">
            <div className="emergency-card">
              <h4>⏰ رزرو فوری</h4>
              <p>
                برای رزرو فوری می‌توانید از طریق واتساپ با ما در ارتباط باشید
              </p>
              <Link
                to={data?.socialMediaInfo?.whatsApp || "#"}
                className="emergency-btn"
              >
                <FaWhatsapp />
                ارتباط فوری از طریق واتساپ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
