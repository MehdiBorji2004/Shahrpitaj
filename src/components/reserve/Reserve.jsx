import { useEffect, useRef, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import DateTimePicker from "./date-time-picker/DateTimePicker";
import SelectBox from "./select-box/SelectBox";
import "./reserve.css";
import "./reserve-responsive.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AlertMessage from "../alert-messages/AlertMessage";
import reservationSchema from "../../schemas/reservationSchema.jsx";

const Reserve = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL || "https://api.shahrpitaj.ir";
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [service_price, setService_price] = useState(null);
  const [service_type, setService_type] = useState(null);
  const [servicer_name, setServicer_name] = useState(null);
  const [errors, setErrors] = useState(null);
  const [reserveErr, setReserveErr] = useState("");
  const [isReserved, setIsReserved] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isSubmited, setIsSubmited] = useState(false);
  let timeoutID = useRef(null);
  const reservationData = {
    service_type,
    servicer_name,
    service_price,
    date,
    time,
    price: service_price,
  };

  const changeState = (childDateState, childTimeState) => {
    setDate(childDateState);
    setTime(childTimeState);
  };

  const change_ServiceType_State = (child_ServiceType_State, service_price) => {
    setService_type(child_ServiceType_State);
    setService_price(service_price);
  };

  const change_ServicerName_State = (child_ServicerName_State) => {
    setServicer_name(child_ServicerName_State);
  };

  const validateData = async () => {
    try {
      const isValid = await reservationSchema.validate(reservationData, {
        abortEarly: false,
      });
      if (isValid) {
        setErrors(null);
        return isValid;
      }
    } catch (err) {
      const newErrors = {};
      err.inner.forEach((err) => (newErrors[err.path] = err.message));
      setErrors(newErrors);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const validateResult = await validateData();
      if (validateResult && isClicked) {
        const res = await axios.post(
          `${baseUrl}/auth/register-reservation`,
          validateResult,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.status === 201) {
          setIsReserved(true);
          setIsSubmited(true);
          timeoutID.current = setTimeout(() => {
            setIsReserved(false);
            setIsSubmited(false);
            navigate("/auth/my-panel");
          }, 2000);
        }
      }
    } catch (error) {
      setReserveErr(
        error.response.data.message ||
          "در یک روز فقط مجاز به رزرو یک نوبت هستید ❌"
      );
      timeoutID.current = setTimeout(() => {
        setReserveErr("");
      }, 3000);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat().format(price);
  };

  useEffect(() => {
    if (timeoutID.current) {
      return () => clearTimeout(timeoutID);
    }
  }, []);

  return (
    <>
      {loading ? (
        <div
          className="reserve-loading d-flex align-items-center justify-content-center"
          style={{ minHeight: "90vh" }}
        >
          <Spinner animation="grow" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          name="reservation-form"
          autoComplete="off"
          className="container-xl reserve-container"
        >
          {isReserved && (
            <AlertMessage
              message={"رزرو شما با موفقیت انجام شد ✅"}
              type={"success"}
            />
          )}
          {reserveErr && <AlertMessage type={"error"} message={reserveErr} />}
          <p className="reserve-title">
            فرم رزرو نوبت <b>شهر پیتاژ</b>
          </p>
          <div className="select-services-box">
            <div className="service-type">
              <SelectBox
                type={"service_type"}
                changeState={change_ServiceType_State}
              />
              {errors && errors.service_type && (
                <p className="data-validate-errors">
                  {" "}
                  * {errors.service_type}{" "}
                </p>
              )}
            </div>
            <div className="servicer-name">
              <SelectBox
                type={"servicer_name"}
                changeState={change_ServicerName_State}
              />
              {errors && errors.servicer_name && (
                <p className="data-validate-errors">
                  {" "}
                  * {errors.servicer_name}{" "}
                </p>
              )}
            </div>
          </div>
          <div>
            <DateTimePicker
              changeState={changeState}
              validateErrors={errors}
              servicerName={servicer_name}
            />
          </div>

          {service_type && servicer_name && date && time && (
            <div className="selection-summary">
              <p className="selection-summary-title">جزئیات نوبت شما :</p>
              <p>نوع خدمات : {service_type}</p>
              <p>خدمات دهنده : {servicer_name}</p>
              <p>
                تاریخ نوبت : {date.jd} {date.monthName} {date.jy}
              </p>
              <p> ساعت نوبت: {time}</p>
              <p>
                هزینه خدمات شما :{" "}
                {service_price ? formatPrice(service_price) : 0} تومان
              </p>
            </div>
          )}

          <div className="submit-reserve">
            <input
              type="submit"
              className={"submit-btn "}
              disabled={isSubmited}
              value={isSubmited ? "ثبت شد" : "تایید و رزرو نوبت"}
              onClick={() => {
                setIsClicked(true);
              }}
            />
          </div>
        </form>
      )}
    </>
  );
};

export default Reserve;
