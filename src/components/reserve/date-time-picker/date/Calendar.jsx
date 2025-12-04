import React, { useState } from "react";
import { toJalaali, toGregorian, jalaaliMonthLength } from "jalaali-js";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "./calendar.css";

const Calendar = ({ onDateSelect, selectedDate, validateErrors }) => {
  const currentDate = new Date();
  const currentJalaliDate = toJalaali(currentDate);
  const [currentMonth, setCurrentMonth] = useState(currentJalaliDate.jm);
  const [currentYear, setCurrentYear] = useState(currentJalaliDate.jy);

  // نام ماه‌های شمسی
  const persianMonths = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ];

  // بررسی آیا تاریخ قابل انتخاب است (امروز یا آینده)
  const isSelectable = (year, month, day) => {
    // بررسی یکشنبه نبودن روز
    const gregorianDate = toGregorian(year, month, day);
    const dateObj = new Date(
      gregorianDate.gy,
      gregorianDate.gm - 1,
      gregorianDate.gd
    );
    const dayOfWeek = dateObj.getDay(); // 0 یکشنبه، 1 دوشنبه، ..., 6 شنبه

    // اگر روز یکشنبه است غیرفعال شود
    if (dayOfWeek === 0) return false;

    if (year > currentJalaliDate.jy) return true;
    if (year === currentJalaliDate.jy && month > currentJalaliDate.jm)
      return true;
    if (
      year === currentJalaliDate.jy &&
      month === currentJalaliDate.jm &&
      day >= currentJalaliDate.jd
    )
      return true;
    return false;
  };

  // بررسی آیا تاریخ انتخاب شده است
  const isSelected = (year, month, day) => {
    if (!selectedDate) return false;
    return (
      year === Number(selectedDate.jy) &&
      month === Number(selectedDate.jm) &&
      day === Number(selectedDate.jd)
    );
  };

  // تولید روزهای ماه
  const generateDays = () => {
    const daysInMonth = jalaaliMonthLength(currentYear, currentMonth);
    const firstDayOfMonth = new Date(
      toGregorian(currentYear, currentMonth, 1).gy,
      toGregorian(currentYear, currentMonth, 1).gm - 1,
      toGregorian(currentYear, currentMonth, 1).gd
    );
    const startingDayOfWeek = firstDayOfMonth.getDay();

    const persianWeekDays = [
      "شنبه",
      "یکشنبه",
      "دوشنبه",
      "سه شنبه",
      "چهارشنبه",
      "پنجشنبه",
      "جمعه",
    ];

    let days = [];

    days.push(
      <div key="weekdays" className="weekdays">
        {persianWeekDays.map((day, index) => (
          <div key={index} className="weekday">
            {day}
          </div>
        ))}
      </div>
    );

    let dayCells = [];
    for (let i = 0; i < (startingDayOfWeek + 1) % 7; i++) {
      dayCells.push(<div key={`empty-${i}`} className="day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        day === currentJalaliDate.jd &&
        currentMonth === currentJalaliDate.jm &&
        currentYear === currentJalaliDate.jy;

      const selectable = isSelectable(currentYear, currentMonth, day);

      dayCells.push(
        <div
          key={`day-${day}`}
          className={`day 
            ${isToday ? "today" : ""} 
            ${
              isSelectable(currentYear, currentMonth, day)
                ? "selectable"
                : "not-selectable"
            }
            ${selectable ? "selectable" : "not-selectable"}
            ${isSelected(currentYear, currentMonth, day) ? "selected" : ""}
          `}
          onClick={() => {
            if (selectable) {
              onDateSelect({
                jy: currentYear,
                jm: currentMonth,
                jd: day,
                monthName: persianMonths[currentMonth - 1],
                isToday: isToday,
              });
            }
          }}
        >
          {day}
        </div>
      );
    }

    days.push(
      <div key="days" className="days">
        {dayCells}
      </div>
    );

    return days;
  };

  // تغییر ماه
  const changeMonth = (direction) => {
    if (direction === "prev") {
      if (currentMonth === 1) {
        setCurrentMonth(12);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 12) {
        setCurrentMonth(1);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
    onDateSelect(null);
  };

  return (
    <div className="persian-calendar">
      <p className="calendar-title">
        تاریخ مورد نظرتان را انتخاب کنید <b>*</b>
      </p>
      <div className="calendar-header">
        <button
          type="button"
          onClick={() => changeMonth("prev")}
          className="changeMonth-btn"
        >
          <IoIosArrowForward />
        </button>
        <h2 className="month-name">
          {persianMonths[currentMonth - 1]} {currentYear}
        </h2>
        <button
          type="button"
          onClick={() => changeMonth("next")}
          className="changeMonth-btn"
        >
          <IoIosArrowBack />
        </button>
      </div>
      <div className="calendar-body" aria-required>
        {generateDays()}
      </div>
      {selectedDate && (
        <div className="selected-date-container">
          <div className="selected-date">
            تاریخ انتخاب شده: {selectedDate.jd}{" "}
            {persianMonths[selectedDate.jm - 1]} {selectedDate.jy}
          </div>
        </div>
      )}
      {validateErrors && validateErrors.date && (
        <p className="data-validate-errors"> * {validateErrors.date} </p>
      )}
    </div>
  );
};

export default Calendar;
