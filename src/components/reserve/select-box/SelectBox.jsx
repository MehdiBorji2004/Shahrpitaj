import { useEffect, useState } from "react";
import "./select-box.css";
import axios from "axios";
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

  const fetchData = async () => {
    try {
      await getServices();
      await getServicers();
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [servicesList, servicersList]);

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
