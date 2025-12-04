import { useEffect, useState } from "react";
import "./select-box.css";
import axios from "axios";

const SelectBox = ({ type, changeState }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [services, setServices] = useState([]);
  const [servicers, setServicers] = useState([]);

  const handleChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedOption(selectedValue);
    
    let servicePrice;
    
    if (type === "service_type") {
      // پیدا کردن سرویس انتخاب شده بر اساس نام
      const selectedService = services.find(
        (service) => service.serviceName === selectedValue
      );
      servicePrice = selectedService?.servicePrice;
    }
    
    changeState(selectedValue, servicePrice);
  };

  const getServices = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/services-list");
      if (res.status === 200) {
        setServices(res.data?.data || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getServicers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/servicers-list");
      if (res.status === 200) {
        setServicers(res.data?.data || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getServices();
    getServicers();
  }, []);

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
          ? services.map((item, index) => {
              return (
                <option key={index} value={item.serviceName}>
                  {item.serviceName}
                </option>
              );
            })
          : servicers.map((item, index) => {
              return (
                <option key={index} value={`${item.first_name} ${item.last_name}`}>
                  {item.first_name} {item.last_name}
                </option>
              );
            })}
      </select>
    </section>
  );
};

export default SelectBox;