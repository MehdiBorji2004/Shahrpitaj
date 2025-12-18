import "./manage-services.css";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { servicesInputData } from "../adminPanelData";
import UseAdminData from "../../../hooks/UseAdminData";
import servicesSchema from "../../../schemas/servisecSchema";
import AlertMessage from "../../alert-messages/AlertMessage";
import { CiCirclePlus } from "react-icons/ci";
import { RiImageAiLine } from "react-icons/ri";
import { MdEdit } from "react-icons/md";
import { RxCrossCircled } from "react-icons/rx";
import { CloseButton, Modal, Spinner } from "react-bootstrap";
import { IoCloudUpload } from "react-icons/io5";
import { CgArrowsExchangeAlt } from "react-icons/cg";
import { Link } from "react-router-dom";

const ManageServices = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL || "https://api.shahrpitaj.ir";
  const [deleteMsg, setDeleteMsg] = useState("");
  const [addMsg, setAddMsg] = useState("");
  const [uploadMsg, setUploadMsg] = useState("");
  const [editMsg, setEditMsg] = useState("");
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showEditServiceForm, setShowEditServiceForm] = useState(false);
  const [showChangeServiceImg, setShowChangeServiceImg] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [service_id, setService_id] = useState(null);
  const [loading, setLoading] = useState(false);
  let timeoutID = useRef(null);
  const [validateErr, setValidateErr] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [portfolioFiles, setPortfolioFiles] = useState([]);
  const [formData, setFormData] = useState({
    serviceName: "",
    serviceDetails: "",
    servicePrice: "",
  });

  const {
    getServices,
    servicesList,
    formatPrice,
    role,
    token,
    errors,
    setErrors,
  } = UseAdminData();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);

    // بررسی تعداد فایل‌ها
    if (files.length > 10) {
      setUploadMsg("حداکثر 10 عکس می‌توانید آپلود کنید");
      return;
    }

    setPortfolioFiles(files);
  };

  const validateFormData = async () => {
    try {
      setValidateErr({});
      const validateData = await servicesSchema.validate(formData, {
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

  const generatePersianPath = (serviceName) => {
    // حذف کاراکترهای خاص و جایگزینی با معادل فارسی
    const persianChars = {
      " ": "-",
      _: "-",
      "،": "",
      ".": "",
      "!": "",
      "?": "",
      "؟": "",
      "(": "",
      ")": "",
    };

    // تبدیل نام سرویس به path
    let path = serviceName;
    Object.keys(persianChars).forEach((char) => {
      path = path.replace(new RegExp("\\" + char, "g"), persianChars[char]);
    });

    return `/${path}`;
  };

  const uploadPortfolio = async (e) => {
    e.preventDefault();
    try {
      if (!token || role !== "admin") return;

      const formDataToSend = new FormData();
      formDataToSend.append("serviceID", service_id);
      portfolioFiles &&
        portfolioFiles.forEach((file) => {
          formDataToSend.append("portfolio_image", file);
        });

      const res = await axios.post(
        `${baseUrl}/admin/upload-portfolio`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 200) {
        await getServices();
        setUploadMsg(res.data.message || "تصاویر با موفقیت آپلود شد");
        setPortfolioFiles([]);
        setShowModal(false);
        setLoading(false);
        timeoutID.current = setTimeout(() => {
          setUploadMsg("");
        }, 3000);
      }
    } catch (error) {
      setErrors(error.response?.data?.message || "خطا در آپلود تصاویر");
      timeoutID.current = setTimeout(() => {
        setErrors("");
      }, 3000);
    }
  };

  const addNewService = async (e) => {
    e.preventDefault();
    try {
      if (!token || role !== "admin") return;

      const validateData = await validateFormData();

      if (validateData) {
        const servicePath = generatePersianPath(validateData.serviceName);

        const formDataToSend = new FormData();
        formDataToSend.append("serviceName", validateData.serviceName);
        formDataToSend.append("serviceDetails", validateData.serviceDetails);
        formDataToSend.append("servicePrice", validateData.servicePrice);
        servicePath && formDataToSend.append("servicePath", servicePath);
        imageFile && formDataToSend.append("image", imageFile);

        const res = await axios.post(
          `${baseUrl}/admin/add-service`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (res.status === 201) {
          getServices();
          setAddMsg(res.data.message || "خدمات جدید با موفقیت ایجاد شد");
          setFormData({
            serviceName: "",
            serviceDetails: "",
            servicePrice: "",
          });
          setImageFile(null);
          setShowServiceForm(false);
          timeoutID.current = setTimeout(() => {
            setAddMsg("");
          }, 3000);
        }
      }
    } catch (error) {
      setErrors(error.response?.data?.message || "خطا در ایجاد خدمات جدید");
      timeoutID.current = setTimeout(() => {
        setErrors("");
      }, 3000);
    }
  };

  const deleteService = async (serviceID) => {
    try {
      if (!token || role !== "admin")
        return console.log("invalid token or role");

      const res = await axios.delete(`${baseUrl}/admin/delete-service`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { serviceID },
      });
      if (res.status === 200) {
        setDeleteMsg(res.data.message || "خدمات مورد نظر با موفقیت حذف شد");
        timeoutID.current = setTimeout(() => {
          setDeleteMsg("");
        }, 3000);
        getServices();
      }
    } catch (error) {
      setErrors(error.response?.data?.message || "خطای سرور در حذف خدمات");
      timeoutID.current = setTimeout(() => {
        setErrors("");
      }, 3000);
    }
  };

  const editService = (serviceID) => {
    setService_id(serviceID);

    const serviceToEdit = servicesList.find(
      (service) => service._id === serviceID
    );

    if (serviceToEdit) {
      setFormData({
        serviceName: serviceToEdit.serviceName || "",
        serviceDetails: serviceToEdit.serviceDetails || "",
        servicePrice: serviceToEdit.servicePrice || "",
      });
    }

    setShowEditServiceForm(true);
  };

  const handleEditService = async (e) => {
    e.preventDefault();

    try {
      if (!token || role !== "admin")
        return console.log("invalid token or role");

      const validate = await validateFormData();
      if (validate) {
        const res = await axios.put(
          `${baseUrl}/admin/edit-service`,
          { serviceID: service_id, newData: validate },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.status === 200) {
          setEditMsg(res.data.message || "خدمات مورد نظر با موفقیت ویرایش شد");
          timeoutID.current = setTimeout(() => {
            setEditMsg("");
          }, 3000);
          getServices();
          setShowEditServiceForm(false);
        }
      }
    } catch (error) {
      setErrors(error.response?.data?.message || "خطا در ویرایش خدمات");
      timeoutID.current = setTimeout(() => {
        setErrors("");
      }, 3000);
    }
  };

  const changeServiseImg = async (e) => {
    e.preventDefault();

    try {
      if (!token || role !== "admin") return;

      const formDataToSend = new FormData();
      formDataToSend.append("serviceID", service_id);
      imageFile && formDataToSend.append("image", imageFile);

      const res = await axios.put(
        `${baseUrl}/admin/change-service-img`,
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
        setUploadMsg(res.data.message || "عکس خدمات با موفقیت تغییر یافت");
        setImageFile(null);
        setShowChangeServiceImg(false);
        await getServices();
        timeoutID.current = setTimeout(() => {
          setUploadMsg("");
        }, 3000);
      }
    } catch (error) {
      setErrors(error.response?.data?.message || "خطا در تغییر عکس خدمات");
      timeoutID.current = setTimeout(() => {
        setErrors("");
      }, 3000);
    }
  };

  useEffect(() => {
    getServices();

    return () => {
      if (timeoutID) clearTimeout(timeoutID);
    };
  }, []);

  return (
    <section className="panel-content">
      {deleteMsg && <AlertMessage type={"success"} message={deleteMsg} />}
      {addMsg && <AlertMessage type={"success"} message={addMsg} />}
      {uploadMsg && <AlertMessage type={"success"} message={uploadMsg} />}
      {editMsg && <AlertMessage type={"success"} message={editMsg} />}
      {errors && <AlertMessage type={"error"} message={errors} />}

      <h3>مدیریت خدمات</h3>
      <div className="services-grid-container">
        {servicesList.length > 0 ? (
          <>
            {servicesList.map((service, index) => (
              <div className="service-card" key={service._id || index}>
                <div className="service-card-header">
                  <Link to={service.servicePath}>
                    <img
                      src={service.imageUrl || "/images/default-service.jpg"}
                      alt={service.serviceName}
                    />
                  </Link>
                  <div className="manage-service-actions">
                    <button
                      className="action-btn change-img-btn"
                      onClick={() => {
                        setShowChangeServiceImg(true);
                        setService_id(service._id);
                      }}
                    >
                      <CgArrowsExchangeAlt />
                      <span>تغییر عکس</span>
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => deleteService(service._id)}
                    >
                      <RxCrossCircled />
                      <span>حذف خدمات</span>
                    </button>
                  </div>
                </div>

                <div className="service-card-body">
                  <h4 className="service-title">{service.serviceName}</h4>
                  <p className="service-price">
                    {formatPrice(service.servicePrice)} تومان
                  </p>
                  <p className="service-details">{service.serviceDetails}</p>
                  <button
                    className="action-btn edit-btn"
                    onClick={() => {
                      editService(service._id);
                    }}
                  >
                    <MdEdit />
                  </button>
                </div>

                <div className="service-card-footer">
                  {service.servicePortfolio.length > 0 ? (
                    <div className="portfolio-preview">
                      {service.servicePortfolio &&
                        service.servicePortfolio
                          .slice(0, 3)
                          .map((img, i) => (
                            <img key={i} src={img} alt="نمونه کار" />
                          ))}
                      {service.servicePortfolio?.length > 3 && (
                        <div className="more-images">
                          +{service.servicePortfolio.length - 3}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p>هیچ نمونه کاری آپلود نشده است! </p>
                  )}
                  <button
                    className="action-btn upload-btn"
                    onClick={() => {
                      setShowModal(true);
                      setService_id(service._id);
                    }}
                  >
                    <IoCloudUpload />
                    <span>آپلود نمونه کار</span>
                  </button>
                </div>
              </div>
            ))}

            <div
              className="service-card add-service-card"
              onClick={() => setShowServiceForm(true)}
            >
              <div className="add-service-content">
                <CiCirclePlus />
                <span>افزودن خدمت جدید</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="no-services">هیچ خدماتی وجود ندارد!</p>
            <div
              className="service-card add-service-card"
              onClick={() => setShowServiceForm(true)}
            >
              <div className="add-service-content">
                <CiCirclePlus />
                <span>افزودن خدمت جدید</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* new service form */}
      <Modal
        show={showServiceForm}
        onHide={() => setShowServiceForm(false)}
        centered
        className="service-form-modal"
      >
        <div className="service-data-container">
          <Modal.Header>
            <Modal.Title>افزودن خدمات جدید</Modal.Title>
            <CloseButton
              className="close-service-form-btn"
              onClick={() => setShowServiceForm(false)}
            />
          </Modal.Header>

          <Modal.Body>
            <form
              onSubmit={(e) => addNewService(e)}
              name="service-data-form"
              encType="multipart/form-data"
              className="service-data-form add-new-service-modal"
            >
              {servicesInputData.map((data, index) => (
                <div key={index} className="new-service-input input-wrapper">
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
                  <span className="input-icon">{data.icon}</span>
                  {validateErr[data.name] && (
                    <p className="user-data-err-msg">
                      <span className="error-icon">⚠</span>
                      {validateErr[data.name]}
                    </p>
                  )}
                </div>
              ))}

              <div className="input-wrapper file-input-wrapper">
                <input
                  className="service-data-input file-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
                <span className="input-icon">
                  <RiImageAiLine />
                </span>
              </div>

              <Modal.Footer className="form-footer">
                <button type="submit" className="btn submit-btn">
                  افزودن خدمات
                </button>
                <button
                  type="button"
                  className="btn cancel-btn"
                  onClick={() => setShowServiceForm(false)}
                >
                  انصراف
                </button>
              </Modal.Footer>
            </form>
          </Modal.Body>
        </div>
      </Modal>

      {/* modal for upload portfolio images */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        className="portfolio-modal"
      >
        <div className="portfolio-form-container">
          <div className="portfolio-form-header">
            <h4>آپلود نمونه کارها</h4>
            <CloseButton
              className="close-portfolio-form"
              onClick={() => setShowModal(false)}
            />
          </div>

          <form
            method="POST"
            encType="multipart/form-data"
            className="portfolio-form-body"
            onSubmit={uploadPortfolio}
          >
            <div
              className="upload-area"
              onClick={() => document.getElementById("portfolio-input").click()}
            >
              <IoCloudUpload />
              <p>برای انتخاب تصاویر کلیک کنیید</p>
              <span className="upload-hint">
                حداکثر 10 تصویر (فرمت: JPG, PNG)
              </span>

              <input
                id="portfolio-input"
                type="file"
                className="hidden-input"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
              />
            </div>

            {portfolioFiles.length > 0 && (
              <div className="upload-preview">
                {portfolioFiles.map((file, index) => (
                  <div key={index} className="preview-item">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`preview ${index + 1}`}
                    />
                    <button
                      type="button"
                      className="remove-preview"
                      onClick={() => {
                        const newFiles = portfolioFiles.filter(
                          (_, i) => i !== index
                        );
                        setPortfolioFiles(newFiles);
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="portfolio-form-footer">
              <button
                type="submit"
                className="portfolio-form-btn submit-portfolio"
                disabled={portfolioFiles.length === 0}
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
                  "آپلود تصاویر"
                )}
              </button>
              <button
                type="button"
                className="portfolio-form-btn cancel-portfolio"
                onClick={() => setShowModal(false)}
              >
                انصراف
              </button>
            </div>
          </form>

          {uploadMsg && (
            <div className="upload-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: "100%" }}></div>
              </div>
              <p className="progress-text">{uploadMsg}</p>
            </div>
          )}
        </div>
      </Modal>

      {/* edit service form */}
      <Modal
        show={showEditServiceForm}
        onHide={() => setShowEditServiceForm(false)}
        centered
        className="service-form-modal"
      >
        <div className="service-data-container">
          <Modal.Header>
            <Modal.Title> ویرایش خدمات </Modal.Title>
            <CloseButton
              className="close-service-form-btn"
              onClick={() => setShowEditServiceForm(false)}
            />
          </Modal.Header>

          <Modal.Body>
            <form
              onSubmit={(e) => handleEditService(e)}
              name="service-data-form"
              className="service-data-form"
            >
              {servicesInputData.map((data, index) => (
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
                  <span className="input-icon">{data.icon}</span>
                  {validateErr[data.name] && (
                    <p className="user-data-err-msg">
                      <span className="error-icon">⚠</span>
                      {validateErr[data.name]}
                    </p>
                  )}
                </div>
              ))}
              <Modal.Footer className="form-footer">
                <input
                  type="submit"
                  value={"ویرایش خدمات"}
                  className="btn submit-btn"
                />
                <button
                  type="button"
                  className="btn cancel-btn"
                  onClick={() => setShowEditServiceForm(false)}
                >
                  انصراف
                </button>
              </Modal.Footer>
            </form>
          </Modal.Body>
        </div>
      </Modal>

      {/* change service image form */}
      <Modal
        show={showChangeServiceImg}
        onHide={() => setShowChangeServiceImg(false)}
        centered
        className="service-form-modal"
      >
        <div className="service-data-container">
          <Modal.Header>
            <Modal.Title> تغییر عکس خدمات </Modal.Title>
            <CloseButton
              className="close-service-form-btn"
              onClick={() => setShowChangeServiceImg(false)}
            />
          </Modal.Header>

          <Modal.Body>
            <form
              onSubmit={(e) => changeServiseImg(e)}
              name="service-data-form"
              encType="multipart/form-data"
              className="service-data-form"
            >
              <div className="input-wrapper file-input-wrapper">
                <input
                  className="service-data-input file-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
                <span className="input-icon">
                  <RiImageAiLine />
                </span>
              </div>

              <Modal.Footer className="form-footer">
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
                    "آپلود تصاویر"
                  )}
                </button>
                <button
                  type="button"
                  className="btn cancel-btn"
                  onClick={() => setShowChangeServiceImg(false)}
                >
                  انصراف
                </button>
              </Modal.Footer>
            </form>
          </Modal.Body>
        </div>
      </Modal>
    </section>
  );
};

export default ManageServices;
