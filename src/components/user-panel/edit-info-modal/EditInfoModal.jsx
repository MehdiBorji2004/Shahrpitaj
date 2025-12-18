import RegisterData from "../../register/RegisterData";
import registerSchema from "../../../schemas/registerSchema";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./edit-info-modal.css";
import { Spinner } from "react-bootstrap";

const EditInfoModal = ({
  modalTitle,
  showModal,
  data,
  dataKey,
  getUserData,
  setEditMessage,
  setErrEditMsg,
}) => {
  const baseUrl = import.meta.env.VITE_BASE_URL || "https://api.shahrpitaj.ir";
  const { signupSchema } = registerSchema;
  const [validateErr, setValidateErr] = useState({});
  const [loading, setLoading] = useState(false);
  let timeouID = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    towel_code: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Validate form data using Yup schema
  const validateFormData = async () => {
    try {
      setValidateErr({});
      const validateData = await signupSchema.validate(formData, {
        abortEarly: false,
      });

      if (validateData) {
        return validateData;
      } else {
        return null;
      }
    } catch (err) {
      const newErrors = {};
      err.inner.forEach((err) => (newErrors[err.path] = err.message));
      setValidateErr(newErrors);
      return null;
    }
  };

  const handleSendData = async (e) => {
    e.preventDefault();
    try {
      const isValid = await validateFormData();
      if (isValid) {
        const res = await axios.post(`${baseUrl}/auth/edit-myInfo`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 200) {
          getUserData();
          showModal(false);
          setEditMessage(res.data?.message || "اطلاعات با موفقیت ویرایش شد ✅");
        }
      }
    } catch (error) {
      console.log(error);
      setErrEditMsg(
        error.reponse?.data?.message ||
          "خطا در ویرایش اطلاعات لطفا بعدا امتحان کنید ❌"
      );
    }
  };

  const handleUploadImage = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      imageFile && formDataToSend.append("image", imageFile);

      const res = await axios.post(
        `${baseUrl}/auth/upload-image`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 200) {
        setLoading(false);
        showModal(false);
        setEditMessage(res.data?.message || "عکس شما با موفقیت آپلود شد");
        await getUserData();
      }
    } catch (error) {
      console.log(error);
      setErrEditMsg(
        error.reponse?.data?.message || "خطا در آپلود عکس لطفا بعدا امتحان کنید"
      );
    }
  };

  const handleCloseModal = () => {
    showModal(false);
  };

  useEffect(() => {
    // مقدار دهی پیشفرض اینپوت ها با داده های قبلی کاربر
    if (data) {
      setFormData((prevData) => ({
        ...prevData,
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        phone: data.phone || "",
        towel_code: data.towel_code || 0,
      }));
    }

    return () => {
      if (timeouID.current) {
        clearTimeout(timeouID.current);
      }
    };
  }, []);

  return (
    <div className="user-panel-modal-container">
      <div className="user-panel-modal-box">
        <p className="modal-title"> {modalTitle} </p>
        {dataKey === "edit-info" ? (
          <form onSubmit={handleSendData} className="edit-info-form">
            {RegisterData[0].inputsData.map((input, index) => (
              <div key={index} className="input-wrapper">
                <label htmlFor={input.name}>
                  {" "}
                  {input.placeholder}
                  <span>*</span>{" "}
                </label>
                <input
                  type={input.type}
                  name={input.name}
                  id={input.name}
                  value={formData[input.name]}
                  onChange={handleChange}
                  placeholder={input.placeholder}
                  minLength={input.minLength}
                  maxLength={input.maxLength}
                  className="user-data-input"
                />
                {validateErr[input.name] && (
                  <p className="user-data-err-msg">{validateErr[input.name]}</p>
                )}
              </div>
            ))}
            <div className="input-wrapper">
              <label htmlFor="towel-code">
                کد حوله (در صورت وجود!)
                <span>*</span>
              </label>
              <input
                type="tel"
                id="towel-code"
                name="towel_code"
                onChange={handleChange}
                value={formData.towel_code}
                className="user-data-input"
              />
            </div>
            <div className="modal-buttons">
              <input
                type="submit"
                className="btn submit-btn"
                value={"ذخیره تغییرات "}
              />
              <button onClick={handleCloseModal} className="btn cancel-btn">
                انصراف
              </button>
            </div>
          </form>
        ) : (
          <form
            onSubmit={handleUploadImage}
            className="upload-profile-form"
            encType="multipart/form-data"
          >
            <div className="input-wrapper">
              <label htmlFor="profile-img">
                عکس پروفایل
                <span>*</span>
              </label>
              <input
                className="user-data-input"
                id="profile-img"
                type="file"
                required
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </div>
            <div className="modal-buttons">
              <button
                type="submit"
                className="portfolio-form-btn submit-portfolio"
                onClick={() => setLoading(true)}
              >
                {loading ? (
                  <>
                    <Spinner
                      animation="border"
                      role="status"
                      variant="light"
                      size="sm"
                    ></Spinner>{" "}
                    در حال آپلود ...
                  </>
                ) : (
                  "آپلود تصویر"
                )}
              </button>
              <button onClick={handleCloseModal} className="btn cancel-btn">
                انصراف
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditInfoModal;
