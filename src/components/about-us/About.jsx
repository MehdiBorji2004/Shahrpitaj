import {
  FaUsers,
  FaAward,
  FaHeart,
  FaStar,
  FaRibbon,
  FaPalette,
  FaClock,
  FaShieldAlt,
} from "react-icons/fa";
import "./about.css";
import MainLayout from "../../layouts/MainLayout";
import { Link } from "react-router-dom";
import UseAdminData from "../../hooks/UseAdminData";
import { useEffect } from "react";
import { Spinner } from "react-bootstrap";

const About = () => {
  const {
    getServices,
    getUsersCount,
    getServicers,
    getGeneralSettingsInfo,
    usersCount,
    servicesList,
    servicersList,
    generalSettingsInfo,
  } = UseAdminData();
  const data = generalSettingsInfo[0];

  const stats = [
    {
      number: `${usersCount || "x"}+`,
      label: "مشتری",
      icon: <FaUsers />,
    },
    {
      number: "7+",
      label: "سال تجربه",
      icon: <FaAward />,
    },
    {
      number: "98%",
      label: "رضایت مشتریان",
      icon: <FaHeart />,
    },
    {
      number: `${servicesList.length || "x"}+`,
      label: "خدمت تخصصی",
      icon: <FaRibbon />,
    },
  ];

  const values = [
    {
      icon: <FaShieldAlt />,
      title: "تضمین کیفیت",
      description:
        "با استفاده از بهترین مواد و تجهیزات، کیفیت خدمات را تضمین می‌کنیم",
    },
    {
      icon: <FaClock />,
      title: "دقت در زمان",
      description:
        "همیشه به وقت مشتریان احترام می‌گذاریم و در زمان مقرر خدمات ارائه می‌دهیم",
    },
    {
      icon: <FaPalette />,
      title: "خلاقیت و نوآوری",
      description: "همواره با جدیدترین متدها و استایل‌ها به روز هستیم",
    },
    {
      icon: <FaStar />,
      title: "تجربه عالی",
      description:
        "هدف ما خلق تجربه‌ای بی‌نظیر و به یاد ماندنی برای هر مشتری است",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getUsersCount();
        await getServices();
        await getServicers();
        await getGeneralSettingsInfo();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <MainLayout>
      <div className="about-page">
        {/* هدر صفحه */}
        <section className="about-hero">
          <div className="hero-content">
            <h1 className="hero-title">
              آرایشگاه {data?.baseInfo?.siteName || "شهر پیتاژ"}
            </h1>
            <p className="hero-subtitle">
              بیش از یک دهه تجربه در ارائه خدمات زیبایی با کیفیت و استانداردهای
              جهانی
            </p>
            <div className="hero-decoration">
              <div className="decoration-circle"></div>
              <div className="decoration-circle"></div>
              <div className="decoration-circle"></div>
            </div>
          </div>
        </section>

        {/* بخش آمار و ارقام */}
        <section className="about-stats-section">
          <div className="container">
            <div className="about-stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="about-stat-card">
                  <div className="about-stat-icon">{stat.icon}</div>
                  <div className="about-stat-number">{stat.number}</div>
                  <div className="about-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* بخش داستان ما */}
        <section className="story-section">
          <div className="container">
            <div className="story-content">
              <div className="story-text">
                <div className="section-header">
                  <h2>داستان ما</h2>
                  <p>از یک آرزو تا یک واقعیت زیبا</p>
                </div>
                <div className="story-description">
                  <p>
                    آرایشگاه {data?.baseInfo?.siteName || "شهر پیتاژ"} در سال
                    xxxx با هدف ایجاد فضایی متفاوت و حرفه‌ای در صنعت آرایش و
                    پیرایش تأسیس شد. ما باور داریم که هر فرد سزاوار آن است که
                    بهترین نسخه خود باشد و در این مسیر، همراهی حرفه‌ای می‌تواند
                    تغییرات شگفت‌انگیزی ایجاد کند.
                  </p>
                  <p>
                    در طول این سال‌ها، با بهره‌گیری از متخصصان مجرب و استفاده از
                    به روزترین تجهیزات و مواد، توانسته‌ایم اعتماد هزاران مشتری
                    را جلب کنیم و به یکی از معتبرترین آرایشگاه های مردانه در
                    شهرستان اهر تبدیل شویم.
                  </p>
                </div>
                <div className="mission-vision">
                  <div className="mission">
                    <h3>ماموریت ما</h3>
                    <p>
                      ارائه خدمات زیبایی با کیفیت جهانی در محیطی آرامش‌بخش و
                      حرفه‌ای، با هدف افزایش اعتماد به نفس و رضایت کامل مشتریان
                    </p>
                  </div>
                  <div className="vision">
                    <h3>چشم‌انداز ما</h3>
                    <p>
                      تبدیل شدن به پیشرو در صنعت زیبایی ایران با معرفی
                      استانداردهای جدید و آموزش نسل آینده متخصصان این حوزه
                    </p>
                  </div>
                </div>
              </div>
              <div className="story-image">
                <div className="image-placeholder">
                  <div className="image-content">
                    <img src="/images/site-logo/site-logo2.png" alt="logo" />
                    <p>آرایشگاه {data?.baseInfo?.siteName || "شهر پیتاژ"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* بخش ارزش‌ها */}
        <section className="values-section">
          <div className="container">
            <div className="section-header">
              <h2>ارزش‌های ما</h2>
              <p>اصولی که به آن‌ها پایبند هستیم</p>
            </div>
            <div className="values-grid">
              {values.map((value, index) => (
                <div key={index} className="value-card">
                  <div className="value-icon">{value.icon}</div>
                  <h3 className="value-title">{value.title}</h3>
                  <p className="value-description">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* بخش تیم ما */}
        <section className="team-section">
          <div className="container">
            <div className="section-header">
              <h2>تیم {data?.baseInfo?.siteName || "شهر پیتاژ"}</h2>
              <p>با مجرب‌ترین متخصصان تیم ما آشنا شوید</p>
            </div>
            <div className="team-grid">
              {servicersList && servicersList.length > 0 ? (
                servicersList.map((servicer, index) => (
                  <div key={index} className="team-card">
                    <div className="member-image">
                      <img
                        src={
                          servicer.imageUrl ||
                          "/images/team-img/team-default-img.png"
                        }
                        alt="img"
                      />
                    </div>
                    <div className="member-info">
                      <h3 className="member-name">
                        {servicer.first_name} {servicer.last_name}
                      </h3>
                      <p className="member-role">{servicer.role}</p>
                      <div className="member-details">
                        <span>
                          {" "}
                          {`سن ${servicer.age} سال` || "تنظیم نشده"}{" "}
                        </span>
                        <span className="experience">
                          {`${servicer.experience} تجربه کاری` || "تنظیم نشده"}
                        </span>
                        <span className="specialty">
                          {`تخصص : ${servicer.specialty}` || "تنظیم نشده"}
                        </span>
                      </div>
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
                  <p>در حال دریافت اعضای تیم...</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* بخش خدمات */}
        <section className="services-section">
          <div className="container">
            <div className="section-header">
              <h2>خدمات تخصصی ما</h2>
              <p>طیف گسترده‌ای از خدمات زیبایی با کیفیت عالی</p>
            </div>
            <div className="about-services-grid">
              {servicesList && servicesList.length > 0 ? (
                servicesList.map((service, index) => (
                  <div key={index} className="about-service-card">
                    <div className="about-service-card-header">
                      <h3 className="service-name">{service.serviceName}</h3>
                    </div>
                    <div className="about-service-card-body">
                      <p className="service-description">
                        {service.serviceDetails}
                      </p>
                    </div>
                    <div className="service-features">
                      <span>مشاوره رایگان</span>
                      <span>ضمانت کیفیت</span>
                      <span>پشتیبانی پس از خدمت</span>
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
                  <p>در حال دریافت خدمات...</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* بخش پایانی */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>آماده ایجاد تغییر هستید؟</h2>
              <p>
                برای تجربه‌ای متفاوت در دنیای زیبایی، همین امروز با ما تماس
                بگیرید یا نوبت خود را رزرو کنید
              </p>
              <div className="cta-buttons">
                <button className="cta-btn primary">
                  <Link to={"/reserve"}> رزرو نوبت </Link>{" "}
                </button>
                <button className="cta-btn secondary">
                  <Link to={"/contact"}>تماس با ما</Link>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default About;
