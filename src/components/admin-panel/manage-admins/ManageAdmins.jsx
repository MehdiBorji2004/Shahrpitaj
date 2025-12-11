import { useEffect, useRef, useState } from "react";
import UseAdminData from "../../../hooks/UseAdminData";
import "./manage-admins.css";
import ManageButtons from "../manage-buttons/ManageButtons";
import { RiAdminFill } from "react-icons/ri";
import axios from "axios";
import AlertMessage from "../../alert-messages/AlertMessage";

const ManageAdmins = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const { getAdmins, adminsList, token, role, errors, setErrors } =
    UseAdminData();
  const adminPhone = import.meta.env.VITE_ADMIN_PHONE;
  const [descentMsg, setDescentMsg] = useState("");
  const timeoutID = useRef(null);

  const descentAdmin = async (adminID) => {
    try {
      if (!token || role !== "admin")
        return console.log("invalid token or role");

      const res = await axios.put(
        `${baseUrl}/admin/descent-admin`,
        { adminID },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.status === 200) {
        console.log("admin descended successfully");
        getAdmins(); // Refresh the admins list after descent
        setDescentMsg(res.data?.message || "ادمین با موفقیت تنزل یافت ✅");
        timeoutID.current = setTimeout(() => {
          setUpgradeMsg("");
        }, 3000);
      }
    } catch (error) {
      console.log(error);
      setErrors(error.response?.data?.message || "خطا در تنزل ادمین ❌");
      timeoutID.current = setTimeout(() => {
        setErrors("");
      }, 3000);
    }
  };

  useEffect(() => {
    getAdmins();

    return () => {
      if (timeoutID) clearTimeout(timeoutID);
    };
  }, []);

  return (
    <section className="panel-content">
      {descentMsg && <AlertMessage type={"success"} message={descentMsg} />}
      {errors && <AlertMessage type={"error"} message={errors} />}
      <h3> مدیریت ادمین ها </h3>
      <div className="admins-list-container">
        <h5>
          <RiAdminFill />
          لیست ادمین ها
        </h5>
        {adminsList.length > 0 ? (
          adminsList.map((admin, index) => (
            <div key={index} className="admin-list-item">
              <div className="admin-info">
                <p>نام : {admin.first_name}</p>
                <p>نام خانوادگی : {admin.last_name}</p>

                <p>شماره تماس : {admin.phone}</p>
                <p>نقش : {admin.role === "admin" ? "ادمین سایت" : ""}</p>
                {admin.phone !== adminPhone ? (
                  <ManageButtons
                    deleteValue="تنزل ادمین"
                    deleteHandler={() => descentAdmin(admin._id)}
                  />
                ) : (
                  <p> تنزل این ادمین مجاز نیست !</p>
                )}
              </div>
              <div className="admin-img">
                <img
                  src={
                    admin.imageUrl || "/images/team-img/team-default-img.png"
                  }
                  alt="img"
                />
              </div>
            </div>
          ))
        ) : (
          <p>هیچ ادمینی یافت نشد.</p>
        )}
      </div>
    </section>
  );
};

export default ManageAdmins;
