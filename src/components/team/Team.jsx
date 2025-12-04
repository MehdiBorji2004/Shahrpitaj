import { useEffect, useState } from "react";
import "./team.css";
import "./team-responsive.css";
import UseAdminData from "../../hooks/UseAdminData";
import { Spinner } from "react-bootstrap";

const Team = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const {
    getServicers,
    getGeneralSettingsInfo,
    servicersList,
    generalSettingsInfo,
  } = UseAdminData();
  const data = generalSettingsInfo[0];

  const handleScroll = () => {
    if (window.scrollY > 1200) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getServicers();
        await getGeneralSettingsInfo();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="main-container">
        <div className="team-top-box"></div>
        <div className="team-container container-xl">
          <div className="section-header">
            <h1 className="team-title">
              تیم پیرایش <span>{data?.baseInfo?.siteName || "شهر پیتاژ"} </span>
            </h1>
          </div>
          {/* بخش تیم ما */}
          <div className="container team-cards-container">
            {servicersList && servicersList.length > 0 ? (
              servicersList.map((servicer, index) => (
                <div
                  key={index}
                  className={
                    isScrolled ? "card team-card animated" : "card team-card"
                  }
                >
                  <div className="card-top-line"></div>
                  <div className="member-image">
                    <img
                      src={
                        servicer?.imageUrl ||
                        "/images/team-img/team-default-img.png"
                      }
                      alt="img"
                      className="card-img-top"
                    />
                  </div>
                  <div className="member-info">
                    <h3 className="member-name">
                      {servicer.first_name} {servicer.last_name}
                    </h3>
                    <p className="member-role">{servicer.role}</p>
                    <div className="member-details">
                      <span> {`سن ${servicer.age} سال` || "تنظیم نشده"} </span>
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
        <div className="team-bottom-box"></div>
      </div>
    </>
  );
};

export default Team;
