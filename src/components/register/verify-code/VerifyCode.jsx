import { useEffect, useRef, useState } from "react";
import RegisterData from "../RegisterData";
import SiteLogo from "../../site-logo/SiteLogo";
import otpSchema from "../../../schemas/OtpSchema";
import axios from "axios";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import AlertMessage from "../../alert-messages/AlertMessage";
import { FiEdit2 } from "react-icons/fi";
import { LiaUserEditSolid } from "react-icons/lia";

const VerifyCode = ({ type }) => {
  const currentData = RegisterData.find((item) => item.type === type);
  const baseUrl =
    import.meta.env.VITE_BASE_URL || "https://api-shahrpitaj.liara.run";
  const navigate = useNavigate();
  let intervalID = useRef(null);
  let timeoutID = useRef(null);
  const [sent_otp, setSent_otp] = useState(false);
  const [sent_otpMsg, setSent_otpMsg] = useState("");
  const [resend_otp, setResend_otp] = useState(false);
  const [verify_otp, setVerify_otp] = useState(false);
  const [registerMsg, setRegisterMsg] = useState("");
  const [verifyErr, setVerifyErr] = useState(false);
  const [verifyErrMsg, setVerifyErrMsg] = useState("");
  const [validateErr, setValidateErr] = useState({});
  const [timer, setTimer] = useState(59);
  const [showTimer, setShowTimer] = useState(false);
  const location = useLocation();
  const [formData, setFormData] = useState({
    otp: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      otp: e.target.value,
    }));
  };

  const validateOtp = async () => {
    try {
      const isValid = await otpSchema.validate(formData, { abortEarly: false });
      if (isValid) {
        setValidateErr({});
        return isValid;
      }
    } catch (err) {
      const newErrors = {};
      err.inner.forEach((err) => (newErrors[err.path] = err.message));
      setValidateErr(newErrors);
      return null;
    }
  };

  // ارسال دیتا به سرور برای تایید کد
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const validateResult = await validateOtp();
      if (validateResult) {
        let res = null;
        type === "verify-signup"
          ? (res = await axios.post(`${baseUrl}/api/verify-signup`, formData))
          : (res = await axios.post(`${baseUrl}/api/verify-login`, formData));

        if (res.status === 200) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("role", res.data.data.role);
          setVerify_otp(true);
          setRegisterMsg(res.data?.message);
          timeoutID.current = setTimeout(() => {
            setVerify_otp(false);
            setRegisterMsg("");
            res.data.data.role === "admin"
              ? navigate("/admin/panel")
              : navigate("/auth/my-panel");
          }, 2000);
        }
      }
    } catch (err) {
      setVerify_otp(false);
      setVerifyErr(true);
      setVerifyErrMsg(
        err.response?.data?.message || "خطا در تایید کد. لطفا دوباره تلاش کنید."
      );
      timeoutID.current = setTimeout(() => {
        setVerifyErr(false);
        setVerifyErrMsg("");
      }, 3000);
    }
  };

  // ارسال مجدد کد تایید
  const handleResend = async () => {
    try {
      if (!formData.phone) {
        setResend_otp("شماره موبایل یافت نشد. بعدا دوباره امتحان کنید!");
        return;
      }

      stopInterval();
      const res = await axios.post(`${baseUrl}/api/resend-otp`, formData);
      if (res.status === 200) {
        setSent_otp(true);
        setSent_otpMsg(res.data.message);
        setResend_otp(false);
        setShowTimer(true);
        startInterval();
        timeoutID.current = setTimeout(() => {
          setSent_otp(false);
          setSent_otpMsg("");
        }, 3000);
      }
    } catch (err) {
      setSent_otp(false);
      setVerifyErr(true);
      setVerifyErrMsg(
        err.response?.data?.message ||
          "خطا در ارسال کد تایید لطفا بعدا امتحان کنید ❌"
      );
      timeoutID.current = setTimeout(() => {
        setVerifyErr(false);
        setVerifyErrMsg("");
      }, 3000);
    }
  };

  // اینترول برای ایجاد تایمر ارسال مجدد بعد از 1 دقیقه
  const startInterval = () => {
    stopInterval();
    if (timer <= 0) {
      setTimer(59);
    }
    intervalID.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setResend_otp(true);
          setShowTimer(false);
          clearInterval(intervalID.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopInterval = () => {
    if (intervalID.current) clearInterval(intervalID.current);
  };

  useEffect(() => {
    // ذخیره شماره کاربر از لوکیشن
    if (location.state?.phone) {
      setFormData((prev) => ({ ...prev, phone: location.state.phone }));
    }

    // نمایش تایمر برای ارسال مجدد
    setShowTimer(true);

    // تایم اوت برای حذف پیغام ارسال شدن کد
    timeoutID.current = setTimeout(() => {
      setSent_otp(false);
      setSent_otpMsg("");
    }, 3000);

    // شروع تایمر
    startInterval();

    return () => {
      stopInterval();
      if (timeoutID.current) clearTimeout(timeoutID.current);
    };
  }, []);

  return (
    <section className="register-page-container">
      <div>
        <SiteLogo />
      </div>

      {sent_otp && <AlertMessage type={"success"} message={sent_otpMsg} />}
      {verify_otp && <AlertMessage type={"success"} message={registerMsg} />}
      {verifyErr && <AlertMessage type={"error"} message={verifyErrMsg} />}

      <div className="user-data-container">
        <h4 className="user-data-head">تایید شماره موبایل</h4>
        <p className="register-text">{currentData.form_text} </p>
        <form onSubmit={handleSubmit} className="user-data__form">
          {currentData.inputsData.map((data, index) => {
            return (
              <div key={index} className="input-wrapper">
                <input
                  autoComplete="on"
                  autoFocus
                  type={data.type}
                  name={data.name}
                  value={formData.otp || ""}
                  onChange={(e) => handleChange(e)}
                  maxLength={data.maxLength}
                  className="user-data-input"
                  style={{ textAlign: "center" }}
                />
                {validateErr.otp && (
                  <p className="user-data-err-msg">{validateErr.otp}</p>
                )}
              </div>
            );
          })}
          <input
            type="submit"
            value="تایید و ثبت نام"
            className="user-data-input send-code-btn"
          />
          <p className="sent-otp-number">
            کد تایید به شماره موبایل {formData.phone} ارسال شده است.
          </p>

          <Link
            to={type === "verify-signup" ? "/signup" : "/login"}
            className="edit-number"
          >
            {type === "verify-signup" ? <LiaUserEditSolid /> : <FiEdit2 />}
            {type === "verify-signup"
              ? "ویرایش اطلاعات "
              : "ویرایش شماره موبایل"}
          </Link>
          {resend_otp && (
            <p onClick={handleResend} className="resend-otp">
              کدی دریافت نکردید؟ <Link onClick={handleResend}>ارسال مجدد</Link>
            </p>
          )}
          {showTimer && (
            <p className="resend-timer">ارسال مجدد کد در {timer} ثانیه</p>
          )}
        </form>
      </div>
    </section>
  );
};

export default VerifyCode;
