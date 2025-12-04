import { Link } from "react-router-dom";
import { FaHome, FaArrowLeft, FaExclamationTriangle } from "react-icons/fa";
import { PiHairDryerFill } from "react-icons/pi";
import { SlMustache } from "react-icons/sl";
import "./not-found-page.css";
import { FaScissors } from "react-icons/fa6";

const NotFound = () => {
  return (
    <div className="not-found-page">
      {/* Background Animation */}
      <div className="not-found-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      <div className="not-found-container">
        {/* Main Content */}
        <div className="not-found-content">
          <div className="error-icon">
            <FaExclamationTriangle />
          </div>

          <h1 className="error-code">404</h1>

          <h2 className="error-title">صفحه مورد نظر یافت نشد</h2>

          <p className="error-description">
            متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا حذف شده است.
            می‌توانید به صفحه اصلی بازگردید یا از جستجو استفاده کنید.
          </p>

          {/* Action Buttons */}
          <div className="action-buttons">
            <Link to="/" className="action-btn primary-btn">
              <FaHome />
              بازگشت به صفحه اصلی
            </Link>

            <button
              onClick={() => window.history.back()}
              className="action-btn secondary-btn"
            >
              <FaArrowLeft />
              بازگشت به صفحه قبل
            </button>
          </div>

          {/* Search Box */}
          {/* <div className="search-section">
            <p>یا صفحه مورد نظر خود را جستجو کنید:</p>
            <div className="search-box">
              <input
                type="search"
                placeholder="چه چیزی را جستجو می‌کنید؟..."
                className="search-input"
              />
              <button className="search-btn">
                <FaSearch />
              </button>
            </div>
          </div> */}

          {/* Quick Links */}
          <div className="quick-links">
            <h3>صفحات پرکاربرد</h3>
            <div className="links-grid">
              <Link to="/services" className="quick-link">
                خدمات ما
              </Link>
              <Link to="/about" className="quick-link">
                درباره ما
              </Link>
              <Link to="/contact" className="quick-link">
                تماس با ما
              </Link>
              <Link to="/reserve" className="quick-link">
                رزرو نوبت
              </Link>
            </div>
          </div>
        </div>

        {/* Illustration */}
        <div className="illustration-section">
          <div className="illustration">
            <div className="astro-illustration">
              <div className="planet"></div>
              <div className="astronaut">
                <div className="helmet"></div>
                <div className="body"></div>
              </div>
              <div className="stars">
                <div className="star">
                  <FaScissors />{" "}
                </div>
                <div className="star">
                  <PiHairDryerFill />
                </div>
                <div className="star">
                  <SlMustache />
                </div>
                <div className="star"></div>
                <div className="star"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
