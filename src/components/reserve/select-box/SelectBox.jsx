import { useCallback, useEffect, useState } from "react";
import "./select-box.css";
import UseAdminData from "../../../hooks/UseAdminData";

const SelectBox = ({ type, changeState }) => {
  const { getServicers, getServices, servicersList, servicesList } =
    UseAdminData();
  const [selectedOption, setSelectedOption] = useState("");

  const handleChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedOption(selectedValue);

    let servicePrice;

    if (type === "service_type") {
      // پیدا کردن سرویس انتخاب شده بر اساس نام
      const selectedService = servicesList.find(
        (service) => service.serviceName === selectedValue
      );
      servicePrice = selectedService?.servicePrice;
    }

    changeState(selectedValue, servicePrice);
  };

  const fetchData = useCallback(async () => {
    try {
      await Promise.all([getServices(), getServicers()]);
    } catch (error) {
      console.error("Error fetching select box data:", error);
    }
  }, [getServices, getServicers]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return (
    <section className="select-box-container">
      <label htmlFor={type} className="select-box-label">
        {type === "service_type"
          ? "خدمات مورد نظر خود را انتخاب کنید"
          : "اجرا کننده خدمات را انتخاب کنید"}{" "}
        <b>*</b>
      </label>

      <select
        onChange={handleChange}
        name={type}
        id={type}
        value={selectedOption}
        className="select-box"
        required
      >
        <option className="default-option" value="" disabled hidden>
          انتخاب کنید...
        </option>
        {type === "service_type"
          ? servicesList.map((item, index) => {
              return (
                <option key={index} value={item.serviceName}>
                  {item.serviceName}
                </option>
              );
            })
          : servicersList.map((item, index) => {
              return (
                <option
                  key={index}
                  value={`${item.first_name} ${item.last_name}`}
                >
                  {item.first_name} {item.last_name}
                </option>
              );
            })}
      </select>
    </section>
  );
};

export default SelectBox;
