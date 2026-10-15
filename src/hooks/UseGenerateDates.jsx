import PersianDate from "persian-date";
import { useCallback } from "react";

const UseGenerateDates = () => {
  const getToday = useCallback(() => {
    return new PersianDate().toLocale("en").format("YYYY-MM-DD");
  }, []);

  const getTomorrow = useCallback(() => {
    return new PersianDate().add("day", 1).toLocale("en").format("YYYY-MM-DD");
  }, []);

  const getYesterday = useCallback(() => {
    return new PersianDate()
      .subtract("day", 1)
      .toLocale("en")
      .format("YYYY-MM-DD");
  }, []);

  const getNextWeek = useCallback(() => {
    return new PersianDate().add("day", 7).toLocale("en").format("YYYY-MM-DD");
  }, []);

  const getLastWeek = useCallback(() => {
    return new PersianDate()
      .subtract("day", 7)
      .toLocale("en")
      .format("YYYY-MM-DD");
  }, []);

  const getNextMonth = useCallback(() => {
    return new PersianDate()
      .add("month", 1)
      .toLocale("en")
      .format("YYYY-MM-DD");
  }, []);

  const getLastMonth = useCallback(() => {
    return new PersianDate()
      .subtract("month", 1)
      .toLocale("en")
      .format("YYYY-MM-DD");
  }, []);

  const getAllPrevData = useCallback(() => {
    return new PersianDate()
      .subtract("year", 50)
      .toLocale("en")
      .format("YYYY-MM-DD");
  }, []);

  const getAllNextData = useCallback(() => {
    return new PersianDate()
      .add("year", 50)
      .toLocale("en")
      .format("YYYY-MM-DD");
  }, []);

  return {
    getToday,
    getTomorrow,
    getYesterday,
    getNextWeek,
    getLastWeek,
    getNextMonth,
    getLastMonth,
    getAllPrevData,
    getAllNextData
  };
};

export default UseGenerateDates;
