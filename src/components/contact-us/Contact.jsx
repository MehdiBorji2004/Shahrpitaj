import * as FaIcons from "react-icons/fa";
import "./contact.css";
import MainLayout from "../../layouts/MainLayout";
import UseAppUtils from "../../hooks/UseAppUtils";
import { useEffect } from "react";
import UseAdminData from "../../hooks/UseAdminData";
import { Link } from "react-router-dom";

const Contact = () => {
  const { getWorkTimes, reserveStartHour, reserveEndHour } = UseAppUtils();
  const { getGeneralSettingsInfo, generalSettingsInfo } = UseAdminData();
  const data = generalSettingsInfo[0];
  const contactInfo = [
    {
      icon: <FaIcons.FaPhone className="info-icon-svg" />,
      title: "تلفن تماس",
      details: [data?.contactInfo?.phone || "تلفن تنظیم نشده است"],
      description: "پاسخگوی شما در ساعات کاری",
    },
    {
      icon: <FaIcons.FaMapMarkerAlt className="info-icon-svg" />,
      title: "آدرس",
      details: [data?.contactInfo?.address || "آدرس تنظیم نشده است"],
      description: `آرایشگاه ${data?.baseInfo?.siteName || ""}`,
    },
    {
      icon: <FaIcons.FaClock className="info-icon-svg" />,
      title: "ساعات کاری",
      details: [
        `شنبه تا جمعه: ${reserveStartHour || "**"}:00 الی ${reserveEndHour || "**"}:00`,
        "یکشنبه ها تعطیل می باشد",
      ],
      description: "پذیرش با رزرو قبلی",
    },
  ];

  const socialLinks = [
    {
      icon: <FaIcons.FaInstagram />,
      name: "اینستاگرام",
      url: data?.socialMediaInfo?.instagram,
      color: "#E4405F",
      description: "جدیدترین مدل‌ها و خدمات",
    },
    {
      icon: <FaIcons.FaWhatsapp />,
      name: "واتساپ",
      url: data?.socialMediaInfo?.whatsApp,
      color: "#25D366",
      description: "پشتیبانی سریع و مستقیم",
    },
    {
      icon: <FaIcons.FaTelegram />,
      name: "تلگرام",
      url: data?.socialMediaInfo?.telegram,
      color: "#0088cc",
      description: "پشتیبانی سریع و مستقیم",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getWorkTimes();
        await getGeneralSettingsInfo();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <MainLayout>
      <div className="contact-page">
        {/* هدر صفحه */}
        <section className="contact-hero">
          <div className="hero-content">
            <h1 className="hero-title">با ما در ارتباط باشید</h1>
            <p className="hero-subtitle">
              از طریق راه‌های مختلف با آرایشگاه{" "}
              {data?.baseInfo?.siteName || "شهر پیتاژ"} در تماس باشید
            </p>
            <div className="hero-decoration">
              <div className="decoration-circle"></div>
              <div className="decoration-circle"></div>
              <div className="decoration-circle"></div>
            </div>
          </div>
        </section>

        {/* بخش اصلی محتوا */}
        <div className="contact-container">
          {/* اطلاعات تماس */}
          <section className="contact-info-section">
            <div className="contact-section-header">
              <h2>راه‌های ارتباطی</h2>
              <p>ما اینجا هستیم تا بهترین خدمات را به شما ارائه دهیم</p>
            </div>

            <div className="contact-info-grid">
              {contactInfo.map((item, index) => (
                <div key={index} className="info-card">
                  <div className="info-icon-wrapper">{item.icon}</div>
                  <h3 className="info-title">{item.title}</h3>
                  <div className="info-details">
                    {item.details.map((detail, idx) => (
                      <p key={idx} className="info-detail">
                        {detail}
                      </p>
                    ))}
                  </div>
                  <p className="info-description">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* شبکه‌های اجتماعی */}
          <section className="social-main-section">
            <div className="contact-section-header">
              <h2>شبکه‌های اجتماعی</h2>
              <p>
                ما را در شبکه‌های اجتماعی دنبال کنید و از آخرین تخفیف‌ها و خدمات
                مطلع شوید
              </p>
            </div>

            <div className="social-grid">
              {socialLinks.map((social, index) => (
                <div
                  key={index}
                  className="social-card"
                  style={{ "--social-color": social.color }}
                >
                  <div className="social-card-header">
                    <div className="social-icon-wrapper">{social.icon}</div>
                    <h3 className="social-card-title">{social.name}</h3>
                  </div>
                  <p className="social-card-description">
                    {social.description}
                  </p>
                  <a href={social.url} className="social-card-link">
                    دنبال کردن
                    <span className="link-arrow">←</span>
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* بخش آدرس و نقشه */}
          <section className="address-section">
            <div className="address-container">
              <div className="address-content">
                <div className="address-header">
                  <FaIcons.FaMapMarkerAlt className="address-main-icon" />
                  <div>
                    <h2>
                      آدرس آرایشگاه {data?.baseInfo?.siteName || "شهر پیتاژ"}{" "}
                    </h2>
                    <p>منتظر دیدار شما هستیم</p>
                  </div>
                </div>

                <div className="address-details">
                  <div className="address-item">
                    <strong>آدرس دقیق:</strong>
                    <p>{data?.contactInfo?.address || "آدرس تنظیم نشده است"}</p>
                  </div>
                </div>
              </div>

              <div className="map-visual">
                  {/* نقشه گوگل */}
                  <iframe
                    width="100%"
                    height="300"
                    style={{ border: 0, borderRadius: "8px" }}
                    // src={`https://www.google.com/maps/embed/v1/place?key=${
                    //   process.env.REACT_APP_GOOGLE_MAPS_API_KEY
                    // }&q=${encodeURIComponent(
                    //   data?.contactInfo?.address || "تهران"
                    // )}&language=fa&region=IR`}
                    allowFullScreen
                    title={`نقشه آرایشگاه ${
                      data?.baseInfo?.siteName || "شهر پیتاژ"
                    }`}
                  />

                  {/* دکمه مسیریابی */}
                  <div className="map-actions">
                    <Link
                      to={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                        data?.contactInfo?.address || ""
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="navigation-btn"
                    >
                      <FaIcons.FaRoute style={{ marginLeft: "8px" }} />
                      مسیریابی
                      <span className="nav-arrow">→</span>
                    </Link>
                  </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default Contact;
