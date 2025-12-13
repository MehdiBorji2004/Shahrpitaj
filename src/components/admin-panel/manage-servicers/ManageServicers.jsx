import "./manage-servicers.css";
import UseAdminData from "../../../hooks/UseAdminData";
import { servicersInputData } from "../adminPanelData";
import { useEffect, useRef, useState } from "react";
import AlertMessage from "../../alert-messages/AlertMessage";
import { CiCirclePlus } from "react-icons/ci";
import { CloseButton, Modal } from "react-bootstrap";
import { RiImageAiLine } from "react-icons/ri";
import servicersSchema from "../../../schemas/servicersSchema";
import axios from "axios";
import ManageButtons from "../manage-buttons/ManageButtons";

const ManageServicers = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL || "https://api.shahrpitaj.ir";
  const { getServicers, servicersList, errors, setErrors, role, token } =
    UseAdminData();
  const [showServicerForm, setShowServicerForm] = useState(false);
  const [showEditServicerForm, setShowEditServicerForm] = useState(false);
  const [showUploadServicerImg, setShowUploadServicerImg] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState("");
  const [addMsg, setAddMsg] = useState("");
  const [editMsg, setEditMsg] = useState("");
  let timeoutID = useRef(null);
  const [validateErr, setValidateErr] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [servicerImgFile, setServicerImgFile] = useState(null);
  const [servicer_id, setServicer_id] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    age: 0,
    role: "",
    experience: "",
    specialty: "",
  });

  const deleteServicer = async (servicerID) => {
    try {
      if (!token || role !== "admin") return;

      const res = await axios.delete(`${baseUrl}/admin/delete-servicer`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { servicerID },
      });

      if (res.status === 200) {
        getServicers();
        setDeleteMsg(res.data.message || "خدمات دهنده با موفقیت حذف شد ✅");
        timeoutID.current = setTimeout(() => {
          setDeleteMsg("");
        }, 3000);
      }
    } catch (error) {
      setErrors(error.response?.data?.message || "خطا در حذف خدمات دهنده ❌");
      timeoutID.current = setTimeout(() => {
        setErrors("");
      }, 3000);
    }
  };

  const editServicerInfo = async (servicerID) => {
    setServicer_id(servicerID);
    const servicerToEdit = servicersList.find(
      (servicer) => servicer._id === servicerID
    );

    if (servicerToEdit) {
      setFormData({
        first_name: servicerToEdit.first_name || "",
        last_name: servicerToEdit.last_name || "",
        age: servicerToEdit.age || "",
        role: servicerToEdit.role || "",
        experience: servicerToEdit.experience || "",
        specialty: servicerToEdit.specialty || "",
      });
    }
    setShowEditServicerForm(true);
  };

  const handleEditServicerInfo = async (e) => {
    e.preventDefault();
    try {
      if (!token || role !== "admin")
        return console.log("invalid token or role");

      const validateData = await validateFormData();

      if (validateData) {
        const res = await axios.put(
          `${baseUrl}/admin/edit-servicer-info`,
          { servicerID: servicer_id, newData: validateData },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 200) {
          setEditMsg(
            res.data.message || "خدمات دهنده مورد نظر با موفقیت ویرایش شد ✅"
          );
          getServicers();
          setShowEditServicerForm(false);
          setFormData({
            first_name: "",
            last_name: "",
            age: 0,
            role: "",
            experience: "",
            specialty: "",
          });

          timeoutID.current = setTimeout(() => {
            setEditMsg("");
          }, 3000);
        }
      }
    } catch (error) {
      setErrors(
        error.response?.data?.message || "خطای سرور در ویرایش خدمات دهنده ❌"
      );
      timeoutID.current = setTimeout(() => {
        setErrors("");
      }, 3000);
    }
  };

  const uploadServicerImg = async (e) => {
    e.preventDefault();
    try {
      if (!token || role !== "admin")
        return console.log("invalid token or role");

      const servicerImage = new FormData();
      servicerImage.append("servicerID", servicer_id);
      servicerImgFile && servicerImage.append("image", servicerImgFile);

      const res = await axios.post(
        `${baseUrl}/admin/upload-servicer-img`,
        servicerImage,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 200) {
        fetchData();
        setShowUploadServicerImg(false);
        setAddMsg(
          res.data.message || "تصویر خدمات دهنده با موفقیت آپلود شد ✅"
        );
        timeoutID.current = setTimeout(() => {
          setAddMsg("");
        }, 3000);
      }
    } catch (error) {
      setErrors(
        error.response?.data?.message || " خطای سرور در آپلود تصویر ❌"
      );
      timeoutID.current = setTimeout(() => {
        setErrors("");
      }, 3000);
    }
  };

  const handleDeleteServicerImg = async (servicerID) => {
    try {
      if (!token || role !== "admin")
        return console.log("invalid token or role");

      const res = await axios.delete(`${baseUrl}/admin/delete-servicer-img`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        params: { servicerID },
      });

      if (res.status === 200) {
        fetchData();
        setDeleteMsg(res.data.message || "تصویر با موفقیت حذف شد ✅");
        timeoutID.current = setTimeout(() => {
          setDeleteMsg("");
        }, 3000);
      }
    } catch (error) {
      setErrors(error.response?.data?.message || " خطای سرور در حذف تصویر ❌");
      timeoutID.current = setTimeout(() => {
        setErrors("");
      }, 3000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateFormData = async () => {
    try {
      setValidateErr({});
      const validateData = await servicersSchema.validate(formData, {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!token || role !== "admin") return;

      const validateData = await validateFormData();

      if (validateData) {
        const formDataToSend = new FormData();
        formDataToSend.append("first_name", validateData.first_name);
        formDataToSend.append("last_name", validateData.last_name);
        formDataToSend.append("age", validateData.age);
        formDataToSend.append("role", validateData.role);
        formDataToSend.append("experience", validateData.experience);
        formDataToSend.append("specialty", validateData.specialty);
        imageFile && formDataToSend.append("image", imageFile);

        const res = await axios.post(
          `${baseUrl}/admin/add-servicer`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (res.status === 201) {
          getServicers();
          setShowServicerForm(false);
          setAddMsg(
            res.data.message || "خدمات دهنده جدید با موفقیت ایجاد شد ✅"
          );
          setFormData({
            first_name: "",
            last_name: "",
            role: "",
          });
          setImageFile(null);
          timeoutID.current = setTimeout(() => {
            setAddMsg("");
          }, 3000);
        }
      }
    } catch (error) {
      setErrors(
        error.response?.data?.message || "خطا در ایجاد خدمات دهنده جدید ❌"
      );
      timeoutID.current = setTimeout(() => {
        setErrors("");
      }, 3000);
    }
  };

  const fetchData = async () => {
    try {
      await getServicers();
    } catch (error) {
      setErrors(error.message);
    }
  };

  useEffect(() => {
    fetchData();

    return () => {
      if (timeoutID.current) clearTimeout(timeoutID.current);
    };
  }, []);

  return (
    <section className="panel-content">
      {errors && <AlertMessage type={"error"} message={errors} />}
      {addMsg && <AlertMessage type={"success"} message={addMsg} />}
      {editMsg && <AlertMessage type={"success"} message={editMsg} />}
      {deleteMsg && <AlertMessage type={"success"} message={deleteMsg} />}
      <h3> مدیریت خدمات دهنده ها </h3>
      {/* servicers info */}
      <div className="servicers-container">
        {servicersList.length > 0 ? (
          servicersList.map((servicer, index) => (
            <div key={index} className="servicers-item">
              <div className="servicers-item-info">
                <div>
                  <p> نام : {servicer.first_name}</p>
                  <p> نام خانوادگی: {servicer.last_name}</p>
                  <p> سن : {servicer.age || "تنظیم نشده"} </p>
                  <p> نقش : {servicer.role || "تنظیم نشده"}</p>
                  <p> تجربه کاری : {servicer.experience || "تنظیم نشده"}</p>
                  <p> تخصص : {servicer.specialty || "تنظیم نشده"}</p>
                </div>
              </div>
              <div className="servicers-item-img-container">
                <div className="servicers-item-img">
                  <img
                    src={
                      servicer.imageUrl ||
                      "/images/team-img/team-default-img.png"
                    }
                    alt="image"
                  />
                </div>

                {servicer.imageUrl ? (
                  <button
                    className="remove-servicer-img-btn"
                    onClick={() => {
                      handleDeleteServicerImg(servicer._id);
                    }}
                  >
                    حذف تصویر
                  </button>
                ) : (
                  <button
                    className="upload-servicer-img-btn"
                    onClick={() => {
                      setShowUploadServicerImg(true);
                      setServicer_id(servicer._id);
                    }}
                  >
                    افزودن تصویر
                  </button>
                )}
              </div>
              <div className="servicer-manage-btns">
                <button
                  className="edit-servicers-info"
                  onClick={() => editServicerInfo(servicer._id)}
                >
                  ویرایش اطلاعات
                </button>
                {servicer.first_name !== "مجتبی" &&
                  servicer.last_name !== "پورمظفر" && (
                    <ManageButtons
                      deleteValue={"حذف خدمات دهنده"}
                      deleteHandler={() => deleteServicer(servicer._id)}
                    />
                  )}
              </div>
            </div>
          ))
        ) : (
          <p>هیچ خدمات دهنده ای وجود ندارد!</p>
        )}

        <div className="add-service-btn-wrapper">
          <button className="btn" onClick={() => setShowServicerForm(true)}>
            افزودن خدمات دهنده <CiCirclePlus />
          </button>
        </div>

        {/* new servicer form */}
        <Modal
          show={showServicerForm}
          onHide={() => setShowServicerForm(false)}
          centered
          className="service-form-modal add-new-servicer-modal"
        >
          <Modal.Header>
            <Modal.Title>افزودن خدمات دهنده جدید</Modal.Title>
            <CloseButton
              onClick={() => setShowServicerForm(false)}
              className="close-service-form-btn"
            />
          </Modal.Header>
          <Modal.Body>
            <div className="service-data-container">
              <form
                onSubmit={(e) => handleSubmit(e)}
                name="service-data-form"
                className="service-data-form"
              >
                {servicersInputData.map((data, index) => {
                  return (
                    <div key={index} className="input-wrapper">
                      <input
                        autoComplete="on"
                        type={data.type}
                        placeholder={data.placeholder}
                        name={data.name}
                        value={formData[data.name] || ""}
                        onChange={(e) => handleChange(e)}
                        minLength={data.minLength}
                        maxLength={data.maxLength}
                        className="service-data-input"
                      />
                      {data.icon}
                      {validateErr[data.name] && (
                        <p className="user-data-err-msg">
                          {validateErr[data.name]}
                        </p>
                      )}
                    </div>
                  );
                })}
                <div className="input-wrapper">
                  <input
                    className="servicer-data-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                  />
                  <RiImageAiLine />
                </div>
                <Modal.Footer className="servicer-modal-footer">
                  <button type="submit" className="btn submit-btn">
                    افزودن خدمات دهنده
                  </button>
                  <button
                    type="button"
                    className="btn cancel-btn"
                    onClick={() => setShowServicerForm(false)}
                  >
                    انصراف
                  </button>
                </Modal.Footer>
              </form>
            </div>
          </Modal.Body>
        </Modal>

        {/* edit servicer info */}
        <Modal
          show={showEditServicerForm}
          onHide={() => setShowEditServicerForm(false)}
          centered
          className="service-form-modal"
        >
          <Modal.Header>
            <Modal.Title>ویرایش اطلاعات خدمات دهنده </Modal.Title>
            <CloseButton
              onClick={() => setShowEditServicerForm(false)}
              className="close-service-form-btn"
            />
          </Modal.Header>
          <Modal.Body>
            <div className="service-data-container">
              <form
                onSubmit={(e) => handleEditServicerInfo(e)}
                className="service-data-form"
              >
                {servicersInputData.map((data, index) => {
                  return (
                    <div key={index} className="input-wrapper">
                      <input
                        autoComplete="on"
                        type={data.type}
                        placeholder={data.placeholder}
                        name={data.name}
                        value={formData[data.name] || ""}
                        onChange={(e) => handleChange(e)}
                        minLength={data.minLength}
                        maxLength={data.maxLength}
                        className="service-data-input"
                      />
                      {data.icon}
                      {validateErr[data.name] && (
                        <p className="user-data-err-msg">
                          {validateErr[data.name]}
                        </p>
                      )}
                    </div>
                  );
                })}
                <Modal.Footer className="servicer-modal-footer">
                  <button type="submit" className="btn submit-btn">
                    ویرایش اطلاعات
                  </button>
                  <button
                    type="button"
                    className="btn cancel-btn"
                    onClick={() => setShowEditServicerForm(false)}
                  >
                    انصراف
                  </button>
                </Modal.Footer>
              </form>
            </div>
          </Modal.Body>
        </Modal>

        {/* upload servicer image */}
        <Modal
          show={showUploadServicerImg}
          onHide={() => setShowUploadServicerImg(false)}
          centered
          className="service-form-modal upload-servicer-img-modal"
        >
          <div className="service-data-container">
            <Modal.Header>
              <Modal.Title> آپلود تصویر خدمات دهنده </Modal.Title>
              <CloseButton
                className="close-service-form-btn"
                onClick={() => setShowUploadServicerImg(false)}
              />
            </Modal.Header>

            <Modal.Body>
              <form
                onSubmit={(e) => uploadServicerImg(e)}
                name="service-data-form"
                encType="multipart/form-data"
                className="service-data-form"
              >
                <div className="input-wrapper file-input-wrapper">
                  <input
                    className="service-data-input file-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setServicerImgFile(e.target.files[0])}
                  />
                  <span className="input-icon">
                    <RiImageAiLine />
                  </span>
                </div>

                <Modal.Footer className="form-footer">
                  <input
                    type="submit"
                    value={"تغییر عکس"}
                    className="btn submit-btn"
                  />
                  <button
                    type="button"
                    className="btn cancel-btn"
                    onClick={() => setShowUploadServicerImg(false)}
                  >
                    انصراف
                  </button>
                </Modal.Footer>
              </form>
            </Modal.Body>
          </div>
        </Modal>
      </div>
    </section>
  );
};

export default ManageServicers;
