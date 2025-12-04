import React, { useEffect, useState } from "react";
import TimePicker from "./time/TimePicker";
import Calendar from "./date/Calendar";

const DateTimePicker = ({ changeState, validateErrors, servicerName }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // تابع کمکی برای فرمت کردن تاریخ
  const formatJalaliDate = (date) => {
    if (!date) return null;
    return {
      ...date,
      jm: String(date.jm).padStart(2, "0"),
      jd: String(date.jd).padStart(2, "0"),
      jy: String(date.jy),
    };
  };

  const handleDateSelect = (date) => {
    setSelectedDate(formatJalaliDate(date));
  };

  useEffect(() => {
    changeState(selectedDate, selectedTime);
  }, [selectedDate, selectedTime]);

  return (
    <div className="date-time-picker">
      <div className="picker-container">
        <Calendar
          onDateSelect={handleDateSelect}
          selectedDate={selectedDate}
          validateErrors={validateErrors}
        />
        <TimePicker
          selectedDate={selectedDate}
          onTimeSelect={setSelectedTime}
          validateErrors={validateErrors}
          servicerName={servicerName}
        />
      </div>
    </div>
  );
};

export default DateTimePicker;
