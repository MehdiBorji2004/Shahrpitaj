import PersianDate from "persian-date";
const UseGenerateDates = () => {
  const getToday = () => {
    return new PersianDate().toLocale("en").format("YYYY-MM-DD");
  };

  const getTomorrow = () => {
    return new PersianDate().add("day", 1).toLocale("en").format("YYYY-MM-DD");
  };

  const getYesterday = () => {
    return new PersianDate()
      .subtract("day", 1)
      .toLocale("en")
      .format("YYYY-MM-DD");
  };

  const getNextWeek = () => {
    return new PersianDate().add("day", 7).toLocale("en").format("YYYY-MM-DD");
  };

  const getLastWeek = () => {
    return new PersianDate()
      .subtract("day", 7)
      .toLocale("en")
      .format("YYYY-MM-DD");
  };

  const getNextMonth = () => {
    return new PersianDate()
      .add("month", 1)
      .toLocale("en")
      .format("YYYY-MM-DD");
  };

  const getLastMonth = () => {
    return new PersianDate()
      .subtract("month", 1)
      .toLocale("en")
      .format("YYYY-MM-DD");
  };

  const getAllPrevData = () => {
    return new PersianDate()
      .subtract("year", 50)
      .toLocale("en")
      .format("YYYY-MM-DD");
  };

  const getAllNextData = () => {
    return new PersianDate()
      .add("year", 50)
      .toLocale("en")
      .format("YYYY-MM-DD");
  };

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
