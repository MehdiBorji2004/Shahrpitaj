import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.css";
import RegisterData from "./RegisterData";
import axios from "axios";
import SiteLogo from "../site-logo/SiteLogo";
import { TbArrowBackUp } from "react-icons/tb";
import AlertMessage from "../alert-messages/AlertMessage";
import registerSchema from "../../schemas/registerSchema";

const Signup = ({ type }) => {
  const currentData = RegisterData.find((item) => item.type === type);
  const { signupSchema, loginSchema } = registerSchema;
  const baseUrl = `${import.meta.env.VITE_BASE_URL}${
    import.meta.env.VITE_PORT
  }`;
  const navigate = useNavigate();
  const [registerErr, setRegisterErr] = useState(false);
  const [registerErrMsg, setRegisterErrMsg] = useState("");
  const [validateErr, setValidateErr] = useState({});
  let timeoutID = useRef(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
  });
  const [sent_otp, setSent_otp] = useState(false);
  const [sent_otpMsg, setSent_otpMsg] = useState("");

  // Handle input changes and update form data state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate form data using Yup schema
  const validateFormData = async () => {
    try {
      setValidateErr({});
      let validateData = null;
      type === "signup"
        ? (validateData = await signupSchema.validate(formData, {
            abortEarly: false,
          }))
        : (validateData = await loginSchema.validate(formData, {
            abortEarly: false,
          }));

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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const validateData = await validateFormData();
      if (validateData) {
        let res = null;
        type === "signup"
          ? (res = await axios.post(`${baseUrl}/api/signup`, validateData))
          : (res = await axios.post(`${baseUrl}/api/login`, validateData));

        if (res.status === 200) {
          setSent_otp(true);
          setSent_otpMsg(res.data.message);
          timeoutID.current = setTimeout(() => {
            type === "signup"
              ? navigate("/verify-signup", { state: { phone: formData.phone } })
              : navigate("/verify-login", { state: { phone: formData.phone } });
            setRegisterErr(false);
            setFormData({});
            setSent_otp(false);
            setSent_otpMsg("");
          }, 1500);
        }
      }
    } catch (err) {
      setRegisterErr(true);
      if (err.response && err.response.data) {
        setRegisterErrMsg(err.response.data.message);
      } else {
        setRegisterErrMsg("خطا در ثبت نام. لطفا دوباره تلاش کنید.");
      }
      timeoutID.current = setTimeout(() => {
        setRegisterErr(false);
        setRegisterErrMsg("");
      }, 3000);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutID.current) {
        clearTimeout(timeoutID.current);
      }
    };
  }, []);

  return (
    <section className="register-page-container">
      <div>
        <SiteLogo />
      </div>
      {registerErr && <AlertMessage type={"error"} message={registerErrMsg} />}
      {sent_otp && <AlertMessage type={"success"} message={sent_otpMsg} />}
      <div className="user-data-container">
        <h4 className="user-data-head">
          {currentData.type === "signup" ? " ثبت نام" : "ورود"}
        </h4>
        <p className="register-text">
          {currentData.form_text}{" "}
          <Link to={currentData.path}>
            {currentData.type === "signup" ? "وارد شوید" : "ثبت نام کنید"}
          </Link>
        </p>
        <form
          onSubmit={(e) => handleSubmit(e)}
          name="user-data-form"
          className="user-data__form"
        >
          {currentData.inputsData.map((data, index) => {
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
                  className="user-data-input"
                />
                {data.icon}
                {validateErr[data.name] && (
                  <p className="user-data-err-msg">{validateErr[data.name]}</p>
                )}
              </div>
            );
          })}
          <input
            type="submit"
            value="ارسال کد تایید"
            className="user-data-input send-code-btn"
          />
        </form>
        <Link to={"/"} className="back-to-home">
          <TbArrowBackUp />
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </section>
  );
};
export default Signup;
