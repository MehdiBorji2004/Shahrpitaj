import UseAdminData from "../../../../hooks/UseAdminData";
import axios from "axios";
import { panelReservesInfo, reservesStats } from "../../adminPanelData";
import { useContext, useEffect, useRef, useState } from "react";
import AlertMessage from "../../../alert-messages/AlertMessage";
import PersianDate from "persian-date";
import { dateContext } from "../../AdminPanel";
import UsersAccordion from "../../../accordion-users/UsersAccordion";
import * as HiIcons from "react-icons/hi2";
import { IoCloseCircle } from "react-icons/io5";

const PanelReservesInfo = ({ dataKey }) => {
  const { convertedDate } = useContext(dateContext);
  const baseUrl = import.meta.env.VITE_BASE_URL || "https://api.shahrpitaj.ir";

  const {
    token,
    role,
    allReserves,
    activeReserves,
    doneReserves,
    canceledReserves,
    setPanelData,
    setErrors,
    getAllReserves,
    getActiveReserves,
    getDoneReserves,
    getCanceledReserves,
    getTotalRevenue,
  } = UseAdminData();

  const timeoutID = useRef(null);
  const [successMsg, setSuccessMsg] = useState("");

  const handleDoneReserve = async (id) => {
    try {
      if (!token || role !== "admin")
        return console.log("invalid token or role");

      const res = await axios.put(
        `${baseUrl}/admin/done-active-reserve`,
        { id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 200) {
        if (convertedDate.startDate && convertedDate.endDate) {
          await fetchData();

          setPanelData((prev) => ({
            ...prev,
            activeReserves: activeReserves.length,
            doneReserves: doneReserves.length,
            totalRevenue: prev.totalRevenue,
          }));
        } else {
          const today = new PersianDate().toLocale("en").format("YYYY-MM-DD");
          await Promise.all([
            getActiveReserves(today, today),
            getDoneReserves(today, today),
            getTotalRevenue(today, today),
          ]);
        }

        setSuccessMsg(
          res.data?.message || "خدمات مربوطه با موفقیت به اتمام رسید ✅"
        );

        timeoutID.current = setTimeout(() => {
          setSuccessMsg("");
        }, 3000);
      }
    } catch (error) {
      setErrors(
        error.response?.data?.message || "خطا در به انجام رساندن خدمات ❌"
      );
      timeoutID.current = setTimeout(() => {
        setErrors("");
      }, 3000);
    }
  };

  const handleCancelReserve = async (id) => {
    try {
      if (!token || role !== "admin")
        return console.log("invalid token or role");

      const res = await axios.delete(`${baseUrl}/admin/cancel-active-reserve`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { id },
      });
      if (res.status === 200) {
        await fetchData();

        setPanelData((prev) => ({
          ...prev,
          activeReserves: activeReserves.length,
          doneReserves: doneReserves.length,
          totalRevenue: prev.totalRevenue,
        }));

        setSuccessMsg(res.data?.message || "نوبت با موفقیت لغو شد ✅");
        timeoutID.current = setTimeout(() => {
          setSuccessMsg("");
        }, 3000);
      }
    } catch (error) {
      setErrors(error.response?.data?.message || "خطا در لغو نوبت ❌");
      timeoutID.current = setTimeout(() => {
        setErrors("");
      }, 3000);
    }
  };

  const fetchData = async () => {
    try {
      await getCanceledReserves();
      if (convertedDate?.startDate && convertedDate?.endDate) {
        await Promise.all([
          getActiveReserves(convertedDate.startDate, convertedDate.endDate),
          getDoneReserves(convertedDate.startDate, convertedDate.endDate),
          getAllReserves(convertedDate.startDate, convertedDate.endDate),
        ]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const reservesAccordionData = [
    {
      title: " کل رزروها",
      icon: <HiIcons.HiClipboardDocumentList style={{ color: "#2094f3" }} />,
      data: allReserves,
      borderColor: "#2094f3",
    },
    {
      title: "رزرو های فعال",
      icon: <HiIcons.HiMiniCheckCircle style={{ color: "#43A047" }} />,
      data: activeReserves,
      borderColor: "#43A047",
    },
    {
      title: " رزرو های انجام شده",
      icon: <HiIcons.HiCheckBadge style={{ color: "#FFD600" }} />,
      data: doneReserves,
      borderColor: "#FFD600",
    },
    {
      title: " رزرو های کنسل شده",
      icon: <IoCloseCircle style={{ color: "#F4511E" }} />,
      data: canceledReserves,
      borderColor: "#F4511E",
    },
  ];

  const getReservesCount = (type) => {
    switch (type) {
      case "total":
        return allReserves?.length || 0;
      case "active":
        return activeReserves?.length || 0;
      case "done":
        return doneReserves?.length || 0;
      case "canceled":
        return canceledReserves?.length || 0;
      default:
        return 0;
    }
  };

  useEffect(() => {
    fetchData();
    if (timeoutID.current) clearTimeout(timeoutID.current);
  }, [convertedDate.startDate, convertedDate.endDate]);

  return (
    <div className="reserves-info-continer">
      {successMsg && <AlertMessage type={"success"} message={successMsg} />}

      {dataKey === "manage-reserves" && (
        <div className="users-stats-container">
          {reservesStats.map((item, index) => {
            return (
              <div
                className="users-stats-item"
                style={{ backgroundColor: item.bgColor }}
                key={index}
              >
                <div className="item-title">
                  <p>{item.title}</p>{" "}
                  <span>{getReservesCount(item.type)} مورد</span>
                </div>
                <div className="item-icon" style={{ color: item.iconColor }}>
                  {item.icon}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {dataKey === "dashboard" ? (
        <div className="reserves-info-container">
          {[reservesAccordionData[1], reservesAccordionData[2]].map(
            (data, index) => {
              return (
                <div className="users-info-item" key={index}>
                  <h5>
                    <span style={{ color: data.iconColor }}>{data.icon}</span>{" "}
                    {data.title}
                  </h5>
                  <UsersAccordion
                    accordionData={data.data}
                    dataKey={"activeReserves"}
                    borderColor={data.borderColor}
                    confirmHandler={handleDoneReserve}
                    deleteHandler={handleCancelReserve}
                    type={"reserves"}
                  />
                </div>
              );
            }
          )}
        </div>
      ) : (
        <div className="reserves-info-container">
          {reservesAccordionData.map((data, index) => {
            return (
              <div className="users-info-item" key={index}>
                <h5>
                  <span style={{ color: data.iconColor }}>{data.icon}</span>{" "}
                  {data.title}
                </h5>
                <UsersAccordion
                  accordionData={data.data}
                  dataKey={"activeReserves"}
                  borderColor={data.borderColor}
                  confirmHandler={handleDoneReserve}
                  deleteHandler={handleCancelReserve}
                  type={"reserves"}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PanelReservesInfo;
