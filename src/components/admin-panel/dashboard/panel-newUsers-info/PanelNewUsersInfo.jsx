import axios from "axios";
import "./panel-newUsers-info.css";
import { useContext, useEffect, useRef, useState } from "react";
import UseAdminData from "../../../../hooks/UseAdminData";
import { dateContext } from "../../AdminPanel";
import { usersStats } from "../../adminPanelData";
import UsersAccordion from "../../../accordion-users/UsersAccordion";
import AlertMessage from "../../../alert-messages/AlertMessage";
import * as HiIcons from "react-icons/hi2";
import { IoCloseCircle } from "react-icons/io5";

const PanelNewUsersInfo = ({ dataKey, showStats }) => {
  const baseUrl = `${import.meta.env.VITE_BASE_URL}${
    import.meta.env.VITE_PORT
  }`;
  const {
    getUsers,
    getActiveUsers,
    getInactiveUsers,
    getNewUsers,
    usersList,
    activeUsersList,
    inactiveUsersList,
    newUsersList,
    role,
    token,
    errors,
    setErrors,
  } = UseAdminData();
  const { convertedDate } = useContext(dateContext);
  const [upgradeMsg, setUpgradeMsg] = useState("");
  const [deleteMsg, setDeleteMsg] = useState("");
  const timeoutID = useRef(null);

  const upgradeUserHandler = async (userID) => {
    try {
      if (!token || role !== "admin")
        return console.log("invalid token or role");

      const res = await axios.put(
        `${baseUrl}/admin/upgrade-user`,
        { userID },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.status === 200) {
        fetchData(); // Refresh the user list after upgrade
        setUpgradeMsg(res.data?.message || "کاربر با موفقیت ارتقاء یافت ✅");
        timeoutID.current = setTimeout(() => {
          setUpgradeMsg("");
        }, 3000);
      }
    } catch (error) {
      setErrors(error.response?.data?.message || "خطا در ارتقاء کاربر ❌");
      timeoutID.current = setTimeout(() => {
        setErrors("");
      }, 3000);
    }
  };

  const deleteUserHandler = async (userID) => {
    try {
      if (!token || role !== "admin")
        return console.log("invalid token or role");

      const res = await axios.delete(
        `${baseUrl}/admin/delete-user`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { userID },
        }
      );
      if (res.status === 200) {
        fetchData(); // Refresh the user list after upgrade
        setDeleteMsg(res.data?.message || "کاربر با موفقیت حذف شد ✅");
        timeoutID.current = setTimeout(() => {
          setDeleteMsg("");
        }, 3000);
      }
    } catch (error) {
      setErrors(error.response?.data?.message || "خطا در حذف کاربر ❌");
      timeoutID.current = setTimeout(() => {
        setErrors("");
      }, 3000);
    }
  };

  const usersAccordionData = [
    {
      title: " کل کاربران",
      icon: <HiIcons.HiUsers style={{ color: "#2094f3" }} />,
      data: usersList,
      borderColor: "#2094f3",
    },
    {
      title: "کاربران فعال",
      icon: <HiIcons.HiMiniCheckCircle style={{ color: "#43A047" }} />,
      data: activeUsersList,
      borderColor: "#43A047",
    },
    {
      title: " کاربران غیرفعال",
      icon: <IoCloseCircle style={{ color: "#F4511E" }} />,
      data: inactiveUsersList,
      borderColor: "#F4511E",
    },
    {
      title: " کاربران جدید",
      icon: <HiIcons.HiUser style={{ color: "#FFD600" }} />,
      data: newUsersList,
      borderColor: "#FFD600",
    },
  ];

  const getUsersCount = (type) => {
    switch (type) {
      case "total":
        return usersList?.length || 0;
      case "active":
        return activeUsersList?.length || 0;
      case "inactive":
        return inactiveUsersList?.length || 0;
      case "new":
        return newUsersList?.length || 0;
      default:
        return 0;
    }
  };

  const fetchData = async () => {
    try {
      if (dataKey && dataKey === "manage-users") {
        await getUsers();
      } else {
        await getUsers(convertedDate.startDate, convertedDate.endDate);
      }
      await getActiveUsers();
      await getInactiveUsers();
      await getNewUsers();
    } catch (error) {
      console.log("error in fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();

    return () => {
      if (timeoutID.current) clearTimeout(timeoutID.current);
    };
  }, [convertedDate]);

  return (
    <div className="new-users-container">
      {upgradeMsg && <AlertMessage type={"success"} message={upgradeMsg} />}
      {deleteMsg && <AlertMessage type={"success"} message={deleteMsg} />}

      {showStats && (
        <div className="users-stats-container">
          {usersStats.map((item, index) => {
            return (
              <div
                className="users-stats-item"
                style={{ backgroundColor: item.bgColor }}
                key={index}
              >
                <div className="item-title">
                  <p>{item.title}</p>{" "}
                  <span>{getUsersCount(item.type)} نفر</span>
                </div>
                <div className="item-icon" style={{ color: item.iconColor }}>
                  {item.icon}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="users-info-container">
        {dataKey && dataKey === "manage-users" ? (
          usersAccordionData.map((data, index) => {
            return (
              <div className="users-info-item" key={index}>
                <h5>
                  <span style={{ color: data.iconColor }}>{data.icon}</span>{" "}
                  {data.title}
                </h5>
                <UsersAccordion
                  accordionData={data.data}
                  dataKey={dataKey}
                  borderColor={data.borderColor}
                  confirmHandler={upgradeUserHandler}
                  deleteHandler={deleteUserHandler}
                  type={"users"}
                />
              </div>
            );
          })
        ) : (
          <div>
            <h5>
              <span style={{ color: usersAccordionData[0].iconColor }}>
                {usersAccordionData[0].icon}
              </span>{" "}
              {usersAccordionData[0].title}
            </h5>
            <UsersAccordion
              accordionData={usersAccordionData[0].data}
              dataKey={dataKey}
              borderColor={usersAccordionData[0].borderColor}
              confirmHandler={upgradeUserHandler}
              deleteHandler={deleteUserHandler}
              type={"users"}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PanelNewUsersInfo;
