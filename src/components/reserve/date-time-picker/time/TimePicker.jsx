import React, { useCallback, useState, useEffect } from "react";
import "./time-picker.css";
import axios from "axios";
import UseAppUtils from "../../../../hooks/UseAppUtils";

const TimePicker = ({
  selectedDate,
  onTimeSelect,
  validateErrors,
  servicerName,
}) => {
  const baseUrl = import.meta.env.VITE_BASE_URL || "https://api.shahrpitaj.ir";
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [reservedTimes, setReservedTimes] = useState([]);
  const [filteredTimes, setFilteredTimes] = useState([]);
  const { getWorkTimes, reserveStartHour, reserveEndHour, durationTime } =
    UseAppUtils();

  const getReservedTimes = useCallback(async (date, name) => {
    if (!date) return;

    try {
      setReservedTimes([]);
      const { jy: year, jm: month, jd: day } = date;

      const res = await axios.get(`${baseUrl}/api/reserved-times`, {
        params: {
          year,
          month,
          day,
          servicerName: name,
        },
      });

      if (res.status === 200) {
        setReservedTimes(res.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching reserved times:", error);
      setReservedTimes([]);
    }
  }, [baseUrl]);

  // تابع برای تبدیل دقیقه به زمان
  const minutesToTime = useCallback((totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}:${minutes.toString().padStart(2, "0")}`;
  }, []);

  const generateTimeSlots = useCallback(() => {
    if (
      !durationTime ||
      durationTime <= 0 ||
      !reserveStartHour ||
      !reserveEndHour
    ) {
      setAvailableTimes([]);
      return;
    }

    const times = [];
    const now = new Date();
    const interval = durationTime;

    const startMinutes = reserveStartHour * 60;
    const endMinutes = reserveEndHour * 60;

    if (selectedDate?.isToday) {
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      if (currentMinutes >= endMinutes) {
        setAvailableTimes([]);
        return;
      }

      let firstAvailableMinute =
        Math.ceil(currentMinutes / interval) * interval;
      firstAvailableMinute = Math.max(firstAvailableMinute, startMinutes);
      firstAvailableMinute = Math.min(firstAvailableMinute, endMinutes);

      for (
        let minute = firstAvailableMinute;
        minute < endMinutes;
        minute += interval
      ) {
        if (minute + interval <= endMinutes) {
          times.push(minutesToTime(minute));
        }
      }
    } else {
      for (let minute = startMinutes; minute < endMinutes; minute += interval) {
        if (minute + interval <= endMinutes) {
          times.push(minutesToTime(minute));
        }
      }
    }

    setAvailableTimes(times);
    setSelectedTime(null);
    onTimeSelect(null);
  }, [
    durationTime,
    reserveStartHour,
    reserveEndHour,
    selectedDate,
    onTimeSelect,
    minutesToTime,
  ]);

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    onTimeSelect(time);
  };

  const filterAvailableTimes = useCallback(() => {
    if (!availableTimes.length || !reservedTimes.length) return availableTimes;
    return availableTimes.filter((time) => !reservedTimes.includes(time));
  }, [availableTimes, reservedTimes]);

  // get data from useAppUtils hook
  const fetchData = useCallback(async () => {
    await getWorkTimes();
  }, [getWorkTimes]);

  // useEffect برای فیلتر کردن زمان‌ها
  useEffect(() => {
    if (availableTimes.length > 0) {
      const filtered = filterAvailableTimes();
      setFilteredTimes(filtered);
    }
  }, [availableTimes, reservedTimes, filterAvailableTimes]);

  // useEffect برای مقداردهی اولیه
  useEffect(() => {
    const initializeData = async () => {
      if (!selectedDate) {
        setAvailableTimes([]);
        setFilteredTimes([]);
        setSelectedTime(null);
        onTimeSelect(null);
        return;
      }

      // ابتدا زمان‌های کاری را دریافت کن
      void fetchData();
    };

    initializeData();
  }, [selectedDate, servicerName, fetchData, onTimeSelect]);

  // useEffect برای تولید زمان‌ها پس از دریافت زمان‌های کاری
  useEffect(() => {
    if (reserveStartHour && reserveEndHour && durationTime) {
      generateTimeSlots();
      getReservedTimes(selectedDate, servicerName);
    }
  }, [
    reserveStartHour,
    reserveEndHour,
    durationTime,
    selectedDate,
    servicerName,
    generateTimeSlots,
    getReservedTimes,
  ]);

  return (
    <div className="time-picker">
      <p className="time-picker-title">
        زمان مورد نظرتان را انتخاب کنید <b>*</b>
      </p>
      {selectedDate ? (
        <div className="time-slots">
          {filteredTimes.length > 0 ? (
            filteredTimes.map((time) => (
              <div
                key={time}
                className={`time-slot ${
                  selectedTime === time ? "selected" : ""
                }`}
                onClick={() => handleTimeSelect(time)}
              >
                {time}
              </div>
            ))
          ) : (
            <p className="end-time-alert">
              زمان رزرو نوبت برای این تاریخ به اتمام رسیده است ❌
            </p>
          )}
        </div>
      ) : (
        <p> برای انتخاب زمان ابتدا باید یک تاریخ را انتخاب کنید! </p>
      )}
      {selectedTime && (
        <div className="selected-time-container">
          <div className="selected-time">زمان انتخاب شده: {selectedTime}</div>
        </div>
      )}
      {validateErrors && validateErrors.time && (
        <p className="data-validate-errors"> * {validateErrors.time} </p>
      )}
    </div>
  );
};

export default TimePicker;
