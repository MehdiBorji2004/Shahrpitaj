import "./users-accordion.css";
import { Accordion } from "react-bootstrap";
import ManageButtons from "../admin-panel/manage-buttons/ManageButtons";
import { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { HiOutlineEye } from "react-icons/hi";
import UseAdminData from "../../hooks/UseAdminData";

const UsersAccordion = ({
  accordionData,
  dataKey,
  borderColor,
  confirmHandler,
  deleteHandler,
  type,
}) => {
  const { formatPrice } = UseAdminData();
  const [visibleItems, setVisibleItems] = useState(5);
  const [loadAll, setLoadAll] = useState(true);
  const [activeKey, setActiveKey] = useState(null);

  if (!accordionData || accordionData.length === 0) {
    return (
      <p>{` هیچ ${type === "reserves" ? "رزروی" : "کاربری"} یافت نشد! `}</p>
    );
  }

  const handleLoadMore = () => {
    setVisibleItems((prev) => prev + 5);
    if (visibleItems + 5 >= accordionData.length) setLoadAll(false);
  };

  const handleLoadAll = () => {
    setVisibleItems(accordionData.length);
    setLoadAll(false);
  };

  const handleLoadLess = () => {
    setVisibleItems(5);
    setLoadAll(true);
  };

  const visibleAccordions = accordionData.slice(0, visibleItems);

  return (
    <div className="accordion-container">
      <Accordion
        activeKey={activeKey}
        onSelect={(key) => setActiveKey(key === activeKey ? null : key)} // toggle
      >
        {visibleAccordions.map((item, index) => {
          const registerDate = item.createdAt.solarDate;
          const registerTime = item.createdAt.time;
          const formatedDate = registerDate.split("-");

          return (
            <Accordion.Item
              eventKey={index.toString()}
              key={item._id || index}
              className="accordion-item"
              style={{ borderRight: `4px solid ${borderColor}` }}
            >
              <Accordion.Header>
                {index + 1}. نام و نام خانوادگی : {item.first_name}{" "}
                {item.last_name}
              </Accordion.Header>

              <Accordion.Body>
                {type === "users" ? (
                  <div className="new-users-item">
                    <p>
                      نام و نام خانوادگی : {item.first_name} {item.last_name}
                    </p>
                    <p> شماره موبایل: {item.phone} </p>
                    <p> کد حوله : {item.towel_code || "-"} </p>
                    <p>
                      تاریخ و زمان ثبت نام : {registerTime} / {formatedDate[2]}-
                      {formatedDate[1]}-{formatedDate[0]}
                    </p>
                    {dataKey === "manage-users" && (
                      <p>
                        نقش :{" "}
                        {item.role === "admin" ? "ادمین سایت" : "کاربر عادی"}
                      </p>
                    )}
                    {item.role !== "admin" && dataKey === "manage-users" && (
                      <ManageButtons
                        confirmValue="ارتقا کاربر"
                        deleteValue="حذف کاربر"
                        confirmHandler={() => confirmHandler(item._id)}
                        deleteHandler={() => deleteHandler(item._id)}
                      />
                    )}
                  </div>
                ) : (
                  <div className="reserves-info-item">
                    <p>
                      نام و نام خانوادگی : {item.first_name} {item.last_name}
                    </p>
                    <p> شماره موبایل : {item.phone} </p>
                    <p> نوع خدمات : {item.service_type || "-"} </p>
                    <p> خدمات دهنده : {item.servicer_name || "-"} </p>
                    <p> کد حوله : {item.towel_code || "-"} </p>
                    <p>
                      تاریخ و ساعت : {item.time} / {item.date.jd}{" "}
                      {item.date.monthName} {item.date.jy}
                    </p>
                    <p> هزینه : {`${formatPrice(item.price)} تومان` || 0} </p>
                    {dataKey === "activeReserves" &&
                      item.status === "active" && (
                        <ManageButtons
                          confirmValue="انجام شد"
                          deleteValue="لغو نوبت"
                          confirmHandler={() => confirmHandler(item._id)}
                          deleteHandler={() => deleteHandler(item._id)}
                        />
                      )}
                  </div>
                )}
              </Accordion.Body>
            </Accordion.Item>
          );
        })}
      </Accordion>

      <div className="load-buttons-container">
        {visibleItems < accordionData.length && (
          <button className="load-more-btn" onClick={handleLoadMore}>
            مشاهده بیشتر <IoIosArrowDown />
          </button>
        )}
        {loadAll && visibleItems < accordionData.length && (
          <button className="load-all-btn" onClick={handleLoadAll}>
            مشاهده همه {accordionData.length}{" "}
            {type === "users" ? "کاربر" : "رزرو"} <HiOutlineEye />
          </button>
        )}
        {visibleItems > 5 && (
          <button className="load-less-btn" onClick={handleLoadLess}>
            مشاهده کمتر <IoIosArrowUp />
          </button>
        )}
      </div>
    </div>
  );
};

export default UsersAccordion;
