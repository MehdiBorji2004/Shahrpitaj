import { panelStats } from "../../adminPanelData";
import UseAdminData from "../../../../hooks/UseAdminData";
import { useContext, useEffect } from "react";
import { DateContext } from "../../dateContext";

const PanelStats = () => {
  const { convertedDate } = useContext(DateContext);

  const {
    panelData,
    formatPrice,
    getUsers,
    getActiveReserves,
    getDoneReserves,
    getTotalRevenue,
  } = UseAdminData();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (convertedDate.startDate && convertedDate.endDate) {
          await Promise.all([
            getUsers(convertedDate.startDate, convertedDate.endDate),
            getActiveReserves(convertedDate.startDate, convertedDate.endDate),
            getDoneReserves(convertedDate.startDate, convertedDate.endDate),
            getTotalRevenue(convertedDate.startDate, convertedDate.endDate),
          ]);
        }
      } catch (error) {
        console.error("error in fetching data:", error);
      }
    };

    void fetchData();
  }, [
    convertedDate.startDate,
    convertedDate.endDate,
    getUsers,
    getActiveReserves,
    getDoneReserves,
    getTotalRevenue,
  ]);

  return (
    <div className="row site-info-container">
      {panelStats.map((item, index) => {
        return (
          <div
            key={index}
            className="col-xl-3 col-lg-4 col-md-6 col-sm-12 site-info-item"
            style={{ backgroundColor: item.bgColor }}
          >
            <div className="item-title">
              <p> {item.title} </p>
              <span>
                {item.dataKey === "totalRevenue"
                  ? formatPrice(panelData[item.dataKey] || 0)
                  : panelData[item.dataKey] || 0}{" "}
                {item.dataKey === "users"
                  ? "نفر"
                  : item.dataKey === "totalRevenue"
                  ? "هزار تومان"
                  : "مورد"}
              </span>
            </div>
            <div className="item-icon" style={{ color: item.iconColor }}>
              {item.icon}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PanelStats;
