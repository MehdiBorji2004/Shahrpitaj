import { useEffect, useRef, useState } from "react";
import { reserveTimesInputs } from "../adminPanelData";
import AlertMessage from "../../alert-messages/AlertMessage";
import "./manage-reserve-times.css";
import axios from "axios";
import UseAdminData from "../../../hooks/UseAdminData";

const ManageReserveTimes = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const { token, errors, setErrors } = UseAdminData();
  const [changeMsg, setChangeMsg] = useState("");
  const timeoutID = useRef(null);
  const [timesData, setTimesData] = useState({
    startHour: 0,
    endHour: 0,
    duration: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTimesData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `${baseUrl}/admin/change-work-times`,
        timesData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 200 || res.status === 201) {
        setChangeMsg(res.data.message || "زمان ها با موفقیت ذخیره شد ✅");
        timesData.startHour = 0;
        timesData.endHour = 0;
        timesData.duration = 0;
        timeoutID.current = setTimeout(() => {
          setChangeMsg("");
        }, 3000);
      }
    } catch (error) {
      setErrors(error.response?.data?.message || " خطا در تغییر زمان ها ❌ ");
      timeoutID.current = setTimeout(() => {
        setErrors("");
      }, 3000);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutID.current) clearTimeout(timeoutID.current);
    };
  }, []);

  return (
    <section className="panel-content manage-reserves-container">
      <h3> مدیریت زمان های رزرو </h3>
      {changeMsg && <AlertMessage type={"success"} message={changeMsg} />}
      {errors && <AlertMessage type={"error"} message={errors} />}
      <form className="start-end-times" onSubmit={handleSubmit}>
        {reserveTimesInputs.map((data, index) => {
          return (
            <div key={index} className="input-wrapper">
              <label htmlFor={data.name}> {data.label} </label>
              <input
                id={data.name}
                required
                autoComplete="on"
                type={data.type}
                placeholder={data.placeholder}
                name={data.name}
                value={timesData[data.name] || ""}
                onChange={(e) => handleChange(e)}
                maxLength={2}
                className="user-data-input"
              />
            </div>
          );
        })}
        <input type="submit" value={"ذخیره تغییرات"} className="btn save-btn" />
      </form>
    </section>
  );
};

export default ManageReserveTimes;
