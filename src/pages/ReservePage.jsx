import { useEffect } from "react";
import Reserve from "../components/reserve/Reserve";
import UseAdminData from "../hooks/UseAdminData";
import MainLayout from "../layouts/MainLayout";
import "./reserve-page.css";
const ReservePage = () => {
  const { getGeneralSettingsInfo, generalSettingsInfo } = UseAdminData();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getGeneralSettingsInfo();
      } catch (error) {
        console.error("error in fetching data!", error);
      }
    };

    void fetchData();
  }, [getGeneralSettingsInfo]);

  return (
    <MainLayout>
      {generalSettingsInfo.length > 0 &&
      generalSettingsInfo[0].systemInfo.allowOnlineReservation ? (
        <Reserve />
      ) : (
        <div className="reservation-disabled">
          <div className="disabled-container">
            <div className="disabled-card">
              <div className="card-header">
                <div className="icon-wrapper">
                  <div className="pulse-animation">
                    <span className="icon">⏸️</span>
                  </div>
                </div>
                <h1 className="title">سرویس رزرو آنلاین</h1>
              </div>

              <div className="card-body">
                <p className="main-message">
                  متأسفانه سرویس رزرو آنلاین در حال حاضر غیرفعال می‌باشد
                </p>
                <p className="description">
                  این امکان به دلایل فنی یا بروزرسانی سیستم موقتاً از دسترس خارج
                  شده است. لطفاً در زمان دیگری مجدداً اقدام فرمایید.
                </p>

                <div className="info-section">
                  <div className="info-item">
                    <span className="info-icon">📅</span>
                    <span className="info-text">به زودی فعال می‌شود</span>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">🔄</span>
                    <span className="info-text">در حال بروزرسانی</span>
                  </div>
                </div>
              </div>

              <div className="card-footer">
                <div className="contact-info">
                  <p className="contact-text">
                    برای اطلاعات بیشتر با پشتیبانی تماس بگیرید
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default ReservePage;
