import "./user-panel.css";
import MainLayout from "../../layouts/MainLayout";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { IoPencilOutline } from "react-icons/io5";
import { TbLogout2 } from "react-icons/tb";
import ReserveBtn from "../reserve-btn/ReserveBtn";
import { useNavigate } from "react-router-dom";
import AlertMessage from "../alert-messages/AlertMessage";
import EditInfoModal from "./edit-info-modal/EditInfoModal";
import UseAdminData from "../../hooks/UseAdminData";
import { Spinner } from "react-bootstrap";

const UserPanel = ({ dataKey }) => {
  const baseUrl = import.meta.env.VITE_BASE_URL || "https://api.shahrpitaj.ir";

  const [userData, setUserData] = useState({});
  const [reservesData, setReservesData] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadImgModal, setUploadImgModal] = useState(false);

  const timeoutID = useRef();
  const navigate = useNavigate();
  const { token, formatPrice } = UseAdminData();

  const showMessage = (type, text) => {
    setMessage({ type, text });
    clearTimeout(timeoutID.current);
    timeoutID.current = setTimeout(
      () => setMessage({ type: "", text: "" }),
      2500
    );
  };

  const getUserData = useCallback(async () => {
    try {
      const res = await axios.get(`${baseUrl}/auth/my-panel`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(res.data.data.existedUser);
    } catch (err) {
      console.error("Error loading user data:", err);
    }
  }, [baseUrl, token]);

  const getReserveData = useCallback(async () => {
    try {
      const res = await axios.get(`${baseUrl}/auth/my-reserves`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setReservesData(res.data.data || []);
    } catch (err) {
      console.error("Error loading reservations:", err);
    }
  }, [baseUrl, token]);

  const handleCancelReserve = async (reserveID) => {
    try {
      const res = await axios.delete(`${baseUrl}/auth/cancel-myReserve`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { reserveID },
      });

      if (res.status === 200) {
        showMessage("success", res.data?.message || "نوبت شما لغو شد");

        setReservesData((prev) => prev.filter((r) => r._id !== reserveID));
        setUserData((prev) => ({
          ...prev,
          totalReserves: Math.max(0, (prev.totalReserves || 0) - 1),
        }));

        await getUserData();
        await getReserveData();
      }
    } catch (err) {
      console.error("Error cancelling reservation:", err);
      showMessage("error", "خطا در لغو نوبت");
      await getReserveData();
      await getUserData();
    }
  };

  const handleDeleteProfile = async () => {
    try {
      const res = await axios.delete(`${baseUrl}/auth/delete-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showMessage("success", res.data?.message || "عکس پروفایل حذف شد");

      setUserData((prev) => ({ ...prev, imageUrl: "" }));
    } catch (err) {
      console.error("Error deleting profile image:", err);
      showMessage("error", "خطای حذف پروفایل");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const fetchData = useCallback(async () => {
    if (!token) return;
    await Promise.all([getUserData(), getReserveData()]);
  }, [token, getUserData, getReserveData]);

  useEffect(() => {
    fetchData();
    return () => clearTimeout(timeoutID.current);
  }, [fetchData]);

  const Layout = dataKey === "admin-panel" ? "div" : MainLayout;

  return (
    <Layout className="user-panel-wrapper">
      <section className="user-panel-container container-xl">
        {message.text && (
          <AlertMessage type={message.type} message={message.text} />
        )}

        <div className="user-panel-header">
          <h4 className="panel-title"> پنل کاربری من </h4>
          <div className="wellcome-msg">
            {userData.first_name && userData.last_name ? (
              <>
                {userData.first_name} {userData.last_name} عزیز خوش آمدید ✨
              </>
            ) : (
              <div
                className="no-services"
                style={{ flexDirection: "row", justifyContent: "start" }}
              >
                <Spinner
                  animation="grow"
                  role="status"
                  variant="primary"
                  size="sm"
                ></Spinner>
                <p>در حال دریافت اطلاعات ...</p>
              </div>
            )}
          </div>
          <button onClick={handleLogout} className="btn logout-btn">
            خروج <TbLogout2 />
          </button>
        </div>

        <div className="user-panel-info">
          <div>
            <p className="my-info"> اطلاعات من 💡 </p>
            {userData.first_name && userData.last_name && userData.phone ? (
              <>
                <div className="info-items">
                  <p>نام : {userData.first_name}</p>
                  <p>نام خانوادگی : {userData.last_name}</p>
                  <p>شماره موبایل : {userData.phone}</p>
                  <p>کد حوله : {userData.towel_code || 0}</p>
                </div>
                <div className="edit-info-buttons">
                  <button
                    className="btn edit-info-btn"
                    onClick={() => setIsModalOpen(true)}
                  >
                    ویرایش <IoPencilOutline />
                  </button>

                  {!userData.imageUrl ? (
                    <button
                      className="btn edit-info-btn"
                      onClick={() => setUploadImgModal(true)}
                    >
                      آپلود عکس
                    </button>
                  ) : (
                    <button
                      className="btn delete-profile-btn"
                      onClick={handleDeleteProfile}
                    >
                      حذف پروفایل
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="no-services" style={{ flexDirection: "row" }}>
                <Spinner
                  animation="grow"
                  role="status"
                  variant="primary"
                  size="sm"
                ></Spinner>
                <p>در حال دریافت اطلاعات ...</p>
              </div>
            )}
          </div>

          <div className="user-info-img">
            <img
              src={userData.imageUrl || "/images/user-default-img.jpg"}
              alt="img"
            />
          </div>
        </div>

        <div className="user-panel-activeReserve">
          <p className="my-activeReserve"> نوبت های فعال 🟢</p>

          {reservesData && reservesData.length > 0 ? (
            <div className="activeReserves-container">
              {reservesData.map((reserve, index) => (
                <div key={reserve._id} className="activeReserve-items">
                  <p> نوبت {index + 1} </p>
                  <p>نوع خدمات : {reserve.service_type}</p>
                  <p>خدمات دهنده : {reserve.servicer_name}</p>
                  <p>
                    تاریخ : {reserve.date.jd} {reserve.date.monthName}{" "}
                    {reserve.date.jy}
                  </p>
                  <p>ساعت : {reserve.time}</p>
                  <p>هزینه : {formatPrice(reserve.price)} تومان</p>

                  <button
                    className="btn cancel-reserve-btn"
                    onClick={() => handleCancelReserve(reserve._id)}
                  >
                    لغو نوبت
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <p className="no-reserve-text">هیچ نوبت فعالی ندارید 🙁</p>
              <ReserveBtn />
            </div>
          )}
        </div>

        <div className="user-panel-prevReserves">
          <p className="my-prevReserves"> کل نوبت‌های من </p>
          {userData.totalReserves > 0 ? (
            <p>تعداد کل رزروها: {userData.totalReserves}</p>
          ) : (
            <span>تاکنون هیچ رزروی نداشته‌اید.</span>
          )}
        </div>
      </section>

      {isModalOpen && (
        <EditInfoModal
          modalTitle="ویرایش اطلاعات"
          showModal={setIsModalOpen}
          data={userData}
          dataKey="edit-info"
          getUserData={getUserData}
          setEditMessage={(msg) => showMessage("success", msg)}
          setErrEditMsg={(msg) => showMessage("error", msg)}
        />
      )}

      {uploadImgModal && (
        <EditInfoModal
          modalTitle="آپلود عکس"
          showModal={setUploadImgModal}
          data={userData}
          dataKey="upload-img"
          getUserData={getUserData}
          setEditMessage={(msg) => showMessage("success", msg)}
          setErrEditMsg={(msg) => showMessage("error", msg)}
        />
      )}
    </Layout>
  );
};

export default UserPanel;
