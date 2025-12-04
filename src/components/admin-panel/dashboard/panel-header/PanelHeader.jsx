import { useContext, useEffect, useState } from "react";
import { startDateItems, endDateItems } from "../../adminPanelData";
import UseGenerateDates from "../../../../hooks/UseGenerateDates";
import UseAdminData from "../../../../hooks/UseAdminData";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "react-bootstrap";
import { dateContext } from "../../AdminPanel";

const PanelHeader = ({ title }) => {
  const { setConvertedDate } = useContext(dateContext);

  const [dropdownStartValue, setDropdownStartValue] = useState("فیلتر تاریخ");
  const [dropdownEndValue, setDropdownEndValue] = useState("فیلتر تاریخ");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const { getUsers, getActiveReserves, getDoneReserves, getTotalRevenue } =
    UseAdminData();

  const {
    getToday,
    getTomorrow,
    getYesterday,
    getNextWeek,
    getLastWeek,
    getNextMonth,
    getLastMonth,
    getAllPrevData,
    getAllNextData,
  } = UseGenerateDates();

  const getStartDate = (e) => {
    const selectedOption = e.target.innerText;
    setDropdownStartValue(selectedOption);

    let date = null;
    switch (selectedOption) {
      case "ماه قبل":
        date = getLastMonth();
        break;
      case "هفته قبل":
        date = getLastWeek();
        break;
      case "دیروز":
        date = getYesterday();
        break;
      case "امروز":
        date = getToday();
        break;
      case "کل اطلاعات":
        date = getAllPrevData();
        break;
      default:
        date = getToday();
        break;
    }
    setStartDate(date);
    if (endDate) {
      getStartEndDate(date, endDate);
    }
  };

  const getEndDate = (e) => {
    const selectedOption = e.target.innerText;
    setDropdownEndValue(selectedOption);

    let date = null;
    switch (selectedOption) {
      case "امروز":
        date = getToday();
        break;
      case "فردا":
        date = getTomorrow();
        break;
      case "هفته بعد":
        date = getNextWeek();
        break;
      case "ماه بعد":
        date = getNextMonth();
        break;
      case "کل اطلاعات":
        date = getAllNextData();
        break;
      default:
        date = getToday();
        break;
    }
    setEndDate(date);
    if (startDate) {
      getStartEndDate(startDate, date);
    }
  };

  const getStartEndDate = (start, end) => {
    setConvertedDate({
      startDate: start,
      endDate: end,
    });
    getUsers(start, end);
    getActiveReserves(start, end);
    getDoneReserves(start, end);
    getTotalRevenue(start, end);
  };

  useEffect(() => {
    const today = getToday();
    getStartEndDate(today, today);
    setDropdownEndValue("امروز");
    setDropdownStartValue("امروز");
  }, []);

  return (
    <div className="content-header">
      <h3> {title} </h3>
      {/* filter date container */}
      <div className="filter-date-container">
        {/* start date dropdown */}
        <Dropdown className="dropdown">
          <span>تاریخ شروع :</span>
          <DropdownToggle className="dropdown-toggle">
            {dropdownStartValue}
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu">
            {startDateItems.map((item, index) => {
              const isActive = item.name === dropdownStartValue;
              return (
                <DropdownItem
                  key={index}
                  className="dropdown-item"
                  onClick={getStartDate}
                  active={isActive}
                  style={{
                    backgroundColor: isActive ? "var(--bs-color)" : "",
                  }}
                >
                  {item.name}
                </DropdownItem>
              );
            })}
          </DropdownMenu>
        </Dropdown>

        {/* end date dropdown */}
        <Dropdown className="dropdown">
          <span>تاریخ پایان :</span>
          <DropdownToggle className="dropdown-toggle">
            {dropdownEndValue}
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu">
            {endDateItems.map((item, index) => {
              const isActive = item.name === dropdownEndValue;
              return (
                <DropdownItem
                  key={index}
                  className="dropdown-item"
                  onClick={getEndDate}
                  active={isActive}
                  style={{
                    backgroundColor: isActive ? "var(--bs-color)" : "",
                  }}
                >
                  {item.name}
                </DropdownItem>
              );
            })}
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
};

export default PanelHeader;
