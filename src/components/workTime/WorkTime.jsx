import "./workTime.css";
import "./workTime-responsive.css";
import UseAdminData from "../../hooks/UseAdminData";
import { useEffect } from "react";
import UseAppUtils from "../../hooks/UseAppUtils";

const WorkTime = () => {
  const { getWorkTimes, reserveStartHour, reserveEndHour } = UseAppUtils();
  const { getGeneralSettingsInfo, generalSettingsInfo } = UseAdminData();
  const data = generalSettingsInfo[0];

  const workTimeData = [
    { time: `شنبه ${reserveStartHour || "**"} صبح تا ${reserveEndHour || "**"} شب` },
    { time: "یکشنبه ها شهر پیتاژ تعطیل می باشد❗" },
    { time: `دوشنبه ${reserveStartHour || "**"} صبح تا ${reserveEndHour || "**"} شب` },
    { time: `سه شنبه ${reserveStartHour || "**"} صبح تا ${reserveEndHour || "**"} شب` },
    { time: `چهارشنبه ${reserveStartHour || "**"} صبح تا ${reserveEndHour || "**"} شب` },
    { time: `پنجشنبه ${reserveStartHour || "**"} صبح تا ${reserveEndHour || "**"} شب` },
    { time: `جمعه ${reserveStartHour || "**"} صبح تا ${reserveEndHour || "**"} شب` },
  ];

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

  return (
    <div className="row container-xl work-time-container">
      <div className="col-6 px-0 work-time-text">
        <h1 className="work-time-title">
          ساعات کاری پیرایش{" "}
          <span>{data?.baseInfo?.siteName || "شهر پیتاژ"} </span>
        </h1>
        <p className="work-time-subtitle">
          آرایشگاه مردانه {data?.baseInfo?.siteName || " شهر پتاژ"} با ساعات
          کاری منظم از شنبه تا جمعه از ساعت {`${reserveStartHour || "**"}:00`} صبح تا{" "}
          {`${reserveEndHour || "**"}:00`} شب (یکشنبه ها تعطیل می باشد!) آماده
          خدمت‌رسانی به شما عزیزان می‌باشد. این ساعات کاری به منظور برنامه‌ریزی
          بهتر و کاهش زمان انتظار شما مشتریان محترم تنظیم شده است. شما می‌توانید
          به صورت آنلاین در هر ساعت از شبانه‌روز نوبت خود را رزرو کرده و در زمان
          دلخواه به آرایشگاه مراجعه نمایید.
        </p>
        <div className="week-days-container">
          {workTimeData.map((item, index) => {
            return (
              <p className="week-days" key={index}>
                {item.time}
              </p>
            );
          })}
        </div>
      </div>
      <div className="col-6 px-0 work-time-img">
        <img className="img-fluid" src="/images/worktime-img.png" alt="clock" />
      </div>
    </div>
  );
};

export default WorkTime;
