import "./services.css";
import Carousel from "../carousel/Carousel";
import { Link } from "react-router-dom";
import CreateComments from "../create-comments/CreateComments";
import * as FaIcons from "react-icons/fa";
import { GiRazor } from "react-icons/gi";
import { PiMaskHappyFill } from "react-icons/pi";
import UseAdminData from "../../hooks/UseAdminData";
import { useEffect, useState } from "react";
import { BsScissors } from "react-icons/bs";
import { Spinner } from "react-bootstrap";

const Services = () => {
  const [isLoading, setIsLoading] = useState(true);
  const {
    getServices,
    getGeneralSettingsInfo,
    servicesList,
    generalSettingsInfo,
    formatPrice,
    setErrors,
  } = UseAdminData();
  const data = generalSettingsInfo[0];

  const serviceFeatures = [
    {
      icon: <FaIcons.FaClock />,
      title: "نوبت‌دهی آنلاین",
      description: "رزرو سریع و آسان نوبت در هر زمان",
    },
    {
      icon: <FaIcons.FaStar />,
      title: "کیفیت عالی",
      description: "استفاده از بهترین مواد و تجهیزات",
    },
    {
      icon: <FaIcons.FaMagic />,
      title: "متخصصان مجرب",
      description: "کادر حرفه‌ای با سال‌ها تجربه",
    },
  ];

  const serviceIcons = {
    "اصلاح موی سر": <BsScissors />,
    "اصلاح صورت": <GiRazor />,
    "پاکسازی پوست": <PiMaskHappyFill />,
    "کراتینه مو": <FaIcons.FaMagic />,
    default: <FaIcons.FaHandScissors />,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await getServices();
        await getGeneralSettingsInfo();
      } catch (error) {
        setErrors("خطا در بارگذاری خدمات");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (servicesList && servicesList.length > 0) {
      setErrors(null);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="services-loading">
        <div className="loading-spinner"></div>
        <p>در حال بارگذاری خدمات...</p>
      </div>
    );
  }

  return (
    <>
      {/* هدر صفحه */}
      <section className="services-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            خدمات آرایشگاه {data?.baseInfo?.siteName || "شهر پیتاژ"}{" "}
          </h1>
          <p className="hero-subtitle">
            با بهترین خدمات آرایشگاهی در محیطی مدرن و حرفه‌ای آشنا شوید
          </p>
          <div className="hero-decoration">
            <div className="decoration-circle"></div>
            <div className="decoration-circle"></div>
            <div className="decoration-circle"></div>
          </div>
        </div>
      </section>

      {/* کاروسل خدمات */}
      <Carousel />

      {/* لیست کامل خدمات */}
      <section className="all-services-section">
        <div className="container-xl">
          <div className="section-header">
            <h2>همه خدمات آرایشگاه</h2>
            <p>طیف کامل خدمات حرفه‌ای ما</p>
          </div>
          <div className="services-grid">
            {servicesList && servicesList.length > 0 ? (
              servicesList.map((service, index) => (
                <div key={index} className="service-item">
                  <div className="service-item-header">
                    <div className="service-item-icon">
                      {serviceIcons[service.serviceName] ||
                        serviceIcons.default}
                    </div>
                    <h3 className="service-item-name">{service.serviceName}</h3>
                  </div>
                  <p className="service-item-description">
                    {service.serviceDetails}
                  </p>
                  <div className="service-item-footer">
                    <div className="service-price">
                      {formatPrice(service.servicePrice)} تومان
                    </div>
                    <Link
                      to={service.servicePath}
                      className="service-item-link"
                    >
                      مشاهده جزئیات
                      <FaIcons.FaArrowLeft className="link-icon" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-services" style={{ flexDirection: "row" }}>
                <Spinner
                  animation="grow"
                  role="status"
                  variant="primary"
                  size="sm"
                ></Spinner>
                <p>در حال دریافت اطلاعات ...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ویژگی‌های خدمات */}
      <section className="service-features-section">
        <div className="container-xl">
          <div className="section-header">
            <h2>چرا خدمات ما خاص است؟</h2>
            <p>تمایز ما در کیفیت و توجه به جزئیات</p>
          </div>
          <div className="service-features-grid">
            {serviceFeatures.map((feature, index) => (
              <div key={index} className="service-feature-card">
                <div className="service-feature-icon">{feature.icon}</div>
                <h3 className="service-feature-title">{feature.title}</h3>
                <p className="service-feature-description">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* نظرات کاربران */}
      <section className="create-comments-section">
        <CreateComments titleName={data?.baseInfo?.siteName || "شهر پیتاژ"} />
      </section>

      {/* CTA Section */}
      <section className="services-cta">
        <div className="container-xl">
          <div className="cta-content">
            <h2>آماده تغییر هستید؟</h2>
            <p>همین حالا نوبت خود را رزرو کنید و تجربه‌ای متفاوت داشته باشید</p>
            <div className="cta-buttons">
              <Link to="/reserve" className="cta-btn primary">
                رزرو نوبت آنلاین
              </Link>
              <Link to="/contact" className="cta-btn secondary">
                تماس با ما
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* </div>
      </section> */}
    </>
  );
};

export default Services;
