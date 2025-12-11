import { useEffect, useRef, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import ReserveBtn from "../reserve-btn/ReserveBtn";
import Features from "../features/Features";
import CreateComments from "../create-comments/CreateComments";
import * as FaIcons from "react-icons/fa";
import * as PiIcons from "react-icons/pi";
import { GiShower } from "react-icons/gi";
import UseAdminData from "../../hooks/UseAdminData";
import AlertMessage from "../alert-messages/AlertMessage";
import axios from "axios";
import "./service-page-creator.css";
import { Link } from "react-router-dom";

const servicesPageData = [
  {
    title: "/اصلاح-موی-سر",
    details: [
      {
        icon: <PiIcons.PiScissorsFill />,
        name: "کوتاهی مو",
        subName: "در صورت رزرو برخوردار می شوید.",
      },
      {
        icon: <GiShower />,
        name: "شستشوی مو",
        subName: "در صورت تمایل برخوردار می شوید.",
      },
      {
        icon: <PiIcons.PiHairDryerFill />,
        name: "حالت دهی مو",
        subName: "در صورت تمایل برخوردار می شوید.",
      },
    ],
  },
  {
    title: "/اصلاح-صورت",
    details: [
      {
        icon: <PiIcons.PiScissorsFill />,
        name: "اصلاح دقیق صورت",
        subName: "اصلاح و تشکیل صورت با دقت بالا توسط تیم متخصص",
      },
      {
        icon: <FaIcons.FaLemon />,
        name: "مراقبت و نرم‌کننده صورت",
        subName: "استفاده از بالزام و روغن مراقبتی برای صورت صحت‌مند",
      },
      {
        icon: <FaIcons.FaFire />,
        name: "ماساژ صورت",
        subName: "ماساژ تسکین‌بخش برای رفاهیت و آرامش بیشتر",
      },
    ],
  },
  {
    title: "/پاکسازی-پوست",
    details: [
      {
        icon: <FaIcons.FaMagic />,
        name: "پاکسازی عمیق پوست",
        subName: "پاکسازی عمیق با استفاده از تکنولوژی مدرن و محصولات درمانی",
      },
      {
        icon: <FaIcons.FaSprayCan />,
        name: "تونینگ و تسکین",
        subName: "کاهش التهاب و تقویت حفاظت طبیعی پوست",
      },
      {
        icon: <FaIcons.FaMask />,
        name: "ماسک درمانی",
        subName: "اعمال ماسک‌های تخصصی برای نوع پوست شما",
      },
    ],
  },
  {
    title: "/کراتینه-مو",
    details: [
      {
        icon: <FaIcons.FaMagic />,
        name: "کراتینه حرفه‌ای",
        subName: "کراتینه با محصولات برترین برندهای جهانی برای موی نرم و براق",
      },
      {
        icon: <FaIcons.FaFeather />,
        name: "تقویت و حفاظت",
        subName: "تقویت ساختار موی ضعیف و حفاظت طولانی‌مدت",
      },
      {
        icon: <FaIcons.FaStar />,
        name: "براقیت و صاف‌کنندگی",
        subName: "موی صاف، براق و درخشان برای مدت طولانی",
      },
    ],
  },
];

const ServicesPageCreator = ({ url }) => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [deleteMsg, setDeleteMsg] = useState("");
  let timeoutID = useRef(null);

  const {
    getServices,
    servicesList,
    getPortfolio,
    portfolioList,
    formatPrice,
    errors,
    setErrors,
    token,
    role,
  } = UseAdminData();

  const currentService = servicesList.find(
    (service) => service.servicePath === url
  );

  const currentServiceData = servicesPageData.find(
    (data) => data.title === url
  );

  // pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = portfolioList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(portfolioList.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const deletePortfolioImage = async (imageUrl) => {
    try {
      if (!token || role !== "admin")
        return console.log("invalid token or role");

      const serviceID = currentService._id;

      const res = await axios.delete(
        `${baseUrl}/admin/delete-service-portfolio`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { serviceID, imageUrl },
        }
      );

      if (res.status === 200) {
        setDeleteMsg(
          res.data.message || "نمونه کار مورد نظر با موفقیت حذف شد ✅"
        );
        timeoutID.current = setTimeout(() => {
          setDeleteMsg("");
        }, 3000);

        getPortfolio(serviceID);
      }
    } catch (error) {
      setErrors(
        error.response?.data?.message || "خطای سرور در حذف نمونه کار ❌"
      );
      timeoutID.current = setTimeout(() => {
        setErrors("");
      }, 3000);
    }
  };

  const serviceStats = [
    {
      icon: <FaIcons.FaClock />,
      value: "۳۰-۴۵ دقیقه",
      label: "زمان تقریبی",
    },
    {
      icon: <FaIcons.FaUsers />,
      value: "۹۸%",
      label: "رضایت مشتریان",
    },
    {
      icon: <FaIcons.FaStar />,
      value: "حرفه‌ای",
      label: "سطح تخصص",
    },
  ];

  useEffect(() => {
    getServices();
  }, []);

  useEffect(() => {
    if (currentService && currentService._id) {
      getPortfolio(currentService._id);
    }
  }, [currentService]);

  return (
    <MainLayout>
      <div className="service-detail-page">
        {/* هدر صفحه */}
        {currentService && (
          <section className="service-hero">
            <div className="hero-background">
              <div className="hero-overlay"></div>
            </div>
            <div className="container-xl">
              <div className="service-hero-content">
                <div className="service-breadcrumb">
                  <Link to="/services">خدمات</Link>
                  <span className="breadcrumb-separator">/</span>
                  <span>{currentService.serviceName}</span>
                </div>
                <h1 className="service-hero-title">
                  {currentService.serviceName}
                </h1>
                <p className="service-hero-description">
                  {currentService.serviceDetails}
                </p>
                <div className="service-hero-stats">
                  {serviceStats.map((stat, index) => (
                    <div key={index} className="service-stat-item">
                      <div className="service-stat-icon">{stat.icon}</div>
                      <div className="service-stat-content">
                        <p className="service-stat-value">{stat.value}</p>
                        <p className="service-stat-label">{stat.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="container-xl">
          {errors && <AlertMessage message={errors} type="error" />}
          {deleteMsg && <AlertMessage message={deleteMsg} type="success" />}

          {currentService ? (
            <div className="service-detail-content">
              {/* بخش قیمت و رزرو */}
              <section className="service-booking-section">
                <div className="booking-card">
                  <div className="price-section">
                    <div className="price-label">هزینه خدمت</div>
                    <div className="price-value">
                      {formatPrice(currentService?.servicePrice) || "xxxx"}{" "}
                      تومان
                    </div>
                    <div className="price-note">شامل تمامی خدمات جانبی</div>
                  </div>
                  <div className="booking-action">
                    <ReserveBtn value={"رزرو این خدمات"} />
                  </div>
                </div>
              </section>

              {/* بخش نمونه کارها */}
              <section className="service-portfolio-section">
                <div className="service-section-header">
                  <FaIcons.FaImages className="service-section-icon" />
                  <h2 className="service-section-title">گالری نمونه کارها</h2>
                </div>

                {portfolioList.length > 0 ? (
                  <>
                    <div className="portfolio-grid">
                      {currentItems.map((item, index) => (
                        <div key={index} className="portfolio-item">
                          <div className="portfolio-image-container">
                            <img
                              src={item}
                              alt="نمونه کار"
                              className="portfolio-image"
                            />
                            {role === "admin" && (
                              <button
                                onClick={() => deletePortfolioImage(item)}
                                className="delete-portfolio-btn"
                                title="حذف نمونه کار"
                              >
                                <FaIcons.FaMinus />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {portfolioList.length > itemsPerPage && (
                      <div className="portfolio-pagination">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="pagination-btn prev-btn"
                        >
                          <FaIcons.FaArrowRight />
                        </button>

                        <div className="pagination-numbers">
                          {[...Array(totalPages)].map((_, index) => (
                            <button
                              key={index}
                              onClick={() => handlePageChange(index + 1)}
                              className={`pagination-number ${
                                currentPage === index + 1 ? "active" : ""
                              }`}
                            >
                              {index + 1}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="pagination-btn next-btn"
                        >
                          <FaIcons.FaArrowLeft />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="no-portfolio">
                    <FaIcons.FaImages className="no-portfolio-icon" />
                    <p>هنوز نمونه کاری برای این خدمت ثبت نشده است.</p>
                  </div>
                )}
              </section>

              {/* بخش جزئیات خدمات */}
              <section className="service-details-section">
                <div className="service-section-header">
                  <FaIcons.FaMagic className="section-icon" />
                  <h2 className="section-title">
                    آنچه در این خدمت دریافت می‌کنید
                  </h2>
                </div>

                {currentServiceData?.details ? (
                  <div className="features-container">
                    <Features data={currentServiceData.details} />
                  </div>
                ) : (
                  <div className="no-details">
                    <p>جزئیات این خدمت در حال آماده‌سازی است.</p>
                  </div>
                )}
              </section>

              {/* بخش نظرات */}
              <section className="comments-section">
                <div className="service-section-header">
                  <FaIcons.FaComments className="section-icon" />
                  <h2 className="section-title">نظرات مشتریان</h2>
                </div>
                <CreateComments titleName={currentService.serviceName} />
              </section>
            </div>
          ) : (
            <div className="service-not-found">
              <div className="not-found-content">
                <h2>خدمت مورد نظر یافت نشد</h2>
                <p>متأسفانه خدمتی با این مشخصات پیدا نکردیم.</p>
                <Link to="/services" className="back-to-services">
                  بازگشت به صفحه خدمات
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ServicesPageCreator;
