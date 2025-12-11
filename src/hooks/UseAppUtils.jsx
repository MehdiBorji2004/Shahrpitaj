import axios from "axios";
import { useState } from "react";

const UseAppUtils = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [reserveStartHour, setReserveStartHour] = useState(null);
  const [reserveEndHour, setReserveEndHour] = useState(null);
  const [durationTime, setDurationTime] = useState(null);

  // get start and end hour of worktime
  const getWorkTimes = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/get-work-times`);
      if (res.status === 200) {
        setReserveStartHour(res.data.data.startHour);
        setReserveEndHour(res.data.data.endHour);
        setDurationTime(res.data.data.duration);
      }
    } catch (error) {
      console.error("خطا در دریافت زمان‌های کاری:", error);
    }
  };

  return {
    getWorkTimes,
    reserveStartHour,
    reserveEndHour,
    durationTime,
  };
};

export default UseAppUtils;
