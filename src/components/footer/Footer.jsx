import { Link } from "react-router-dom";
import "./footer.css";
import "./footer-responsive.css";
import ReserveBtn from "../reserve-btn/ReserveBtn";
import UseAdminData from "../../hooks/UseAdminData";
import { useEffect } from "react";
import * as FaIcons from "react-icons/fa";

const Footer = () => {
  const { getGeneralSettingsInfo, generalSettingsInfo, token, role } = UseAdminData();
  const data = generalSettingsInfo[0];

  const footerData = [
    {
      title: "لینک های مفید",
      links: [
        { name: "صفحه اصلی", path: "/" },
        { name: "خدمات", path: "/services" },
        { name: "درباره ما", path: "/about" },
        { name: "تماس با ما", path: "/contact" },
      ],
    },
    {
      title: "لینک های کاربردی",
      links: [
        { name: "حساب کاربری", path: token && role === "admin" ? "/admin/panel" : "/auth/my-panel" },
        { name: "رزرو نوبت", path: "/reserve" },
      ],
    },
    {
      title: "شبکه های اجتماعی",
      links: [
        {
          name: "اینستاگرام",
          path: data?.socialMediaInfo?.instagram,
          target: "_blank",
          title: "اینستاگرام شهر پیتاژ",
          rel: "noopener noreferrer",
          icon: <FaIcons.FaInstagram />,
        },
        {
          name: "واتساپ",
          path: data?.socialMediaInfo?.whatsApp,
          target: "_blank",
          title: "واتساپ شهر پیتاژ",
          rel: "noopener noreferrer",
          icon: <FaIcons.FaWhatsapp />,
        },
        {
          name: "تلگرام",
          path: data?.socialMediaInfo?.telegram,
          target: "_blank",
          title: "تلگرام شهر پیتاژ",
          rel: "noopener noreferrer",
          icon: <FaIcons.FaTelegram />,
        },
      ],
    },
  ];

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
    <div className="footer-box">
      <div className="container-xl row footer-container">
        {/* footer logo */}
        <section className="col-4 footer-logo">
          <Link to="/" className="footer-logo-link">
            <img
              src="/images/site-logo/site-logo2.png"
              alt="Logo"
              className="footer-logo-img"
            />
            <div className="footer-logo-text">
              <p className="footer-logo-title">
                آرایشگاه مردانه {data?.baseInfo?.siteName || "شهر پیتاژ"}{" "}
              </p>
              <p className="footer-logo-subtitle">هنر ما در زیبایی شماست</p>
            </div>
          </Link>
        </section>

        {/* footer links */}
        <section className="col-4 footer-links">
          <div className="footer-useful-links">
            <p className="useful-links-title">لینک های مفید</p>
            <ul className="useful-links-list">
              {footerData[0].links.map((link, index) => {
                return (
                  <li key={index} className="useful-links-item">
                    <Link to={link.path}> {link.name} </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="footer-user-links">
            <p className="user-links-title">لینک های کاربری</p>
            <ul className="user-links-list">
              {footerData[1].links.map((link, index) => {
                return (
                  <li key={index} className="useful-links-item">
                    <Link to={link.path}> {link.name} </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* footer adderss & socail medias */}
        <section className="col-4 footer-info">
          <div className="footer-reserve-btn">
            <ReserveBtn />
          </div>
          <div className="footer-address">
            <p>
              {data?.contactInfo?.address || "شهرستان اهر، آرایشگاه شهر پیتاژ"}
            </p>
          </div>
          <div className="footer-contacts">
            <span className="footer-contacts-title">راه های ارتباطی :</span>
            <div className="footer-contacts-icons">
              {footerData[2].links.map((link, index) => {
                return (
                  <Link
                    key={index}
                    to={link.path}
                    target={link.target}
                    rel={link.rel}
                    title={link.title}
                  >
                    {link.icon}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="footer-credits">
            <p>
              تمامی حقوق برای آرایشگاه مردانه{" "}
              {data?.baseInfo?.siteName || "شهر پیتاژ"} محفوظ است. ©{" "}
            </p>
          </div>
          <div className="developer-name">
            <Link
              to="https://t.me/+989224774342"
              target="_blank"
              rel="noopener noreferrer"
              title="طراح و توسعه دهنده"
            >
              <p>
                طراحی و توسعه توسط
                <b className="text-primary">&lt;/Mehdi Borji&gt;</b>
              </p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Footer;
