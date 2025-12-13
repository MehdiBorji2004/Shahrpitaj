import axios from "axios";
import { useEffect, useRef, useState } from "react";

const UseAdminData = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL || "https://api.shahrpitaj.ir";

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const [errors, setErrors] = useState("");
  const [usersList, setUsersList] = useState([]);
  const [usersCount, setUsersCount] = useState(0);
  const [adminsList, setAdminsList] = useState([]);
  const [allReserves, setAllReserves] = useState([]);
  const [activeReserves, setActiveReserves] = useState([]);
  const [doneReserves, setDoneReserves] = useState([]);
  const [canceledReserves, setCanceledReserves] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [servicersList, setServicersList] = useState([]);
  const [commentsList, setCommentsList] = useState([]);
  const [portfolioList, setPortfolioList] = useState([]);
  const [activeUsersList, setActiveUsersList] = useState([]);
  const [inactiveUsersList, setInactiveUsersList] = useState([]);
  const [newUsersList, setNewUsersList] = useState([]);
  const [generalSettingsInfo, setGeneralSettingsInfo] = useState([]);
  const timeoutID = useRef(null);
  const [panelData, setPanelData] = useState({
    users: 0,
    activeReserves: 0,
    doneReserves: 0,
    totalRevenue: 0,
  });

  const getUsers = async (startDate = null, endDate = null) => {
    try {
      const res = await axios.get(`${baseUrl}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { startDate, endDate },
      });
      if (res.status === 200) {
        setPanelData((prevData) => ({
          ...prevData,
          users: res.data.data.length,
        }));
        setUsersList(res.data?.data || []);
      }
    } catch (error) {
      setErrors(error.response?.data?.message || "خطا در دریافت لیست کاربران");
      timeoutID.current = setTimeout(() => {
        setErrors("");
      }, 3000);
    }
  };

  const getUsersCount = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/users-count`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setUsersCount(res.data.data || 0);
      }
    } catch (error) {
      setErrors(error.response?.data?.message || "خطا در دریافت تعداد کاربران");
      timeoutID.current = setTimeout(() => {
        setErrors("");
      }, 3000);
    }
  };

  const getAdmins = async () => {
    try {
      if (!token || role !== "admin")
        return console.log("invalid token or role");

      const res = await axios.get(`${baseUrl}/admin/admins-list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        setAdminsList(res.data?.data || []);
      }
    } catch (error) {
      setErrors(error.response?.data?.message || "خطا در دریافت لیست ادمین ها");
      timeoutID.current = setTimeout(() => {
        setErrors("");
      }, 3000);
    }
  };

  const getAllReserves = async (startDate = null, endDate = null) => {
    try {
      if (!token || role !== "admin")
        return console.log("invalid token or role");
      const res = await axios.get(`${baseUrl}/admin/all-reserves`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { startDate, endDate },
      });
      if (res.status === 200) {
        setAllReserves(res.data.data || []);
      }
    } catch (error) {
      setErrors(error.response?.data?.message || "خطا در دریافت لیست رزرو ها");
      timeoutID.current = setTimeout(() => {
        setErrors("");
      }, 3000);
    }
  };

  const getActiveReserves = async (startDate, endDate = null) => {
    try {
      if (!token || role !== "admin")
        return console.log("invalid token or role");

      const res = await axios.get(`${baseUrl}/admin/activeReserves`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { startDate, endDate },
      });
      if (res.status === 200) {
        setActiveReserves(res.data.data || []);
        setPanelData((prevData) => ({
          ...prevData,
          activeReserves: res.data.data.length,
        }));
      }
    } catch (error) {
      setErrors(error.response?.data?.message || "خطا در دریافت رزرو های فعال");
      timeoutID.current = setTimeout(() => {
        setErrors("");
      }, 3000);
    }
  };

  const getDoneReserves = async (startDate = null, endDate = null) => {
    try {
      if (!token || role !== "admin")
        return console.log("invalid token or role");

      const res = await axios.get(`${baseUrl}/admin/doneReserves`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { startDate, endDate },
      });
      if (res.status === 200) {
        setDoneReserves(res.data.data || []);
        setPanelData((prevData) => ({
          ...prevData,
          doneReserves: res.data.data.length,
        }));
      }
    } catch (error) {
      setErrors(error.response?.data?.message || "خطا در دریافت کل رزرو ها");
      timeoutID.current = setTimeout(() => {
        setErrors("");
      }, 3000);
    }
  };

  const getCanceledReserves = async () => {
    try {
      if (!token || role !== "admin")
        return console.log("invalid token or role");

      const res = await axios.get(`${baseUrl}/admin/canceledReserves`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        setCanceledReserves(res.data.data || []);
      }
    } catch (error) {
      setErrors(error.response?.data?.message || "خطا در لغو رزرو ها");
      timeoutID.current = setTimeout(() => {
        setErrors("");
      }, 3000);
    }
  };

  const getTotalRevenue = async (startDate, endDate = null) => {
    try {
      if (!token || role !== "admin")
        return console.log("invalid token or role");

      const res = await axios.get(`${baseUrl}/admin/totalRevenue`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { startDate, endDate },
      });
      if (res.status === 200) {
        setPanelData((prevData) => ({
          ...prevData,
          totalRevenue: res.data.data,
        }));
      }
    } catch (error) {
      // console.log(error);
    }
  };

  const getServices = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/services-list`);
      if (res.status === 200) {
        setServicesList(res.data.data || []);
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const getServicers = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/servicers-list`);
      if (res.status === 200) {
        setServicersList(res.data.data || []);
      }
    } catch (error) {
      setErrors(
        error.response?.data?.message || "خطا در دریافت لیست خدمات دهنده ها"
      );
      timeoutID.current = setTimeout(() => {
        setErrors("");
      }, 3000);
    }
  };

  const getComments = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/comments-list`);
      if (res.status === 200) {
        setCommentsList(res.data.data || []);
      }
    } catch (error) {
      setErrors(error.response?.data?.message || "خطا در دریافت لیست کامنت ها");
      timeoutID.current = setTimeout(() => {
        setErrors("");
      }, 3000);
    }
  };

  const getPortfolio = async (serviceID) => {
    try {
      const res = await axios.get(`${baseUrl}/api/portfolio-list`, {
        params: { serviceID },
      });

      if (res.status === 200) {
        setPortfolioList(res.data.data);
      }
    } catch (error) {
      setErrors(
        error.response?.data?.message || "خطا در دریافت لیست نمونه کارها"
      );
      timeoutID.current = setTimeout(() => {
        setErrors("");
      }, 3000);
    }
  };

  const getActiveUsers = async () => {
    try {
      if (!token || role !== "admin")
        return console.log("invalid token or role");

      const res = await axios.get(`${baseUrl}/admin/active-users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        setActiveUsersList(res.data.data || []);
      }
    } catch (error) {
      setErrors(
        error.response?.data?.message || "خطا در دریافت لیست کاربران فعال"
      );
      timeoutID.current = setTimeout(() => {
        setErrors("");
      }, 3000);
    }
  };

  const getInactiveUsers = async () => {
    try {
      if (!token || role !== "admin")
        return console.log("invalid token or role");

      const res = await axios.get(`${baseUrl}/admin/inactive-users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        setInactiveUsersList(res.data.data || []);
      }
    } catch (error) {
      setErrors(
        error.response?.data?.message || "خطا در دریافت لیست کاربران غیرفعال"
      );
      timeoutID.current = setTimeout(() => {
        setErrors("");
      }, 3000);
    }
  };

  const getNewUsers = async () => {
    try {
      if (!token || role !== "admin")
        return console.log("invalid token or role");

      const res = await axios.get(`${baseUrl}/admin/new-users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        setNewUsersList(res.data.data || []);
      }
    } catch (error) {
      setErrors(
        error.response?.data?.message || "خطا در دریافت لیست کاربران جدید"
      );
      timeoutID.current = setTimeout(() => {
        setErrors("");
      }, 3000);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat().format(price);
  };

  const getGeneralSettingsInfo = async () => {
    try {
      console.log("VITE_BASE_URL:", import.meta.env.VITE_BASE_URL);

      const res = await axios.get(`${baseUrl}/api/general-settings-info`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setGeneralSettingsInfo(res.data.data || []);
      }
    } catch (error) {
      setErrors(error.response?.data?.message || "خطا در دریافت اطلاعات سایت");
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

  return {
    token,
    role,
    errors,
    setErrors,
    usersList,
    usersCount,
    adminsList,
    allReserves,
    activeReserves,
    doneReserves,
    canceledReserves,
    panelData,
    setPanelData,
    servicesList,
    servicersList,
    commentsList,
    portfolioList,
    activeUsersList,
    inactiveUsersList,
    newUsersList,
    generalSettingsInfo,
    getUsers,
    getUsersCount,
    getAdmins,
    getAllReserves,
    getActiveReserves,
    getDoneReserves,
    getCanceledReserves,
    getTotalRevenue,
    getServices,
    getServicers,
    getComments,
    getPortfolio,
    getActiveUsers,
    getInactiveUsers,
    getNewUsers,
    formatPrice,
    getGeneralSettingsInfo,
  };
};

export default UseAdminData;
