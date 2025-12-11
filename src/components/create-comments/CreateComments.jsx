import { useEffect, useRef, useState } from "react";
import "./create-comments.css";
import AlertMessage from "../alert-messages/AlertMessage";
import commentSchema from "../../schemas/commentSchema";
import axios from "axios";

const CreateComments = ({ titleName }) => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  let timeouID = useRef();
  const token = localStorage.getItem("token");
  const [loginMessage, setLoginMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    user_comment: "",
  });

  const validateFormData = async () => {
    try {
      const isValid = await commentSchema.validate(formData, {
        abortEarly: false,
      });

      if (isValid) {
        setErrors({});
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
      if (token) {
        setLoginMessage(false);

        const validateData = await validateFormData();
        if (validateData) {
          const res = await axios.post(
            `${baseUrl}/auth/user-comment`,
            validateData,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (res.status === 201) {
            setSuccessMessage(res.data.message);
            setFormData((prev) => ({ ...prev, user_comment: "" }));
            timeouID.current = setTimeout(() => {
              setSuccessMessage("");
            }, 3000);
          }
        }
      } else {
        setLoginMessage(true);
        timeouID.current = setTimeout(() => {
          setLoginMessage(false);
        }, 3000);
      }
    } catch (err) {
      if (err.res && err.res.data) {
        setErrMessage(err.res.data.message);
      } else {
        setErrMessage(" خطا در ثبت نظر لطفا بعدا امتحان کنید");
      }
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, user_comment: value }));
  };

  useEffect(() => {
    return () => {
      if (timeouID.current) {
        clearTimeout(timeouID.current);
      }
    };
  }, []);

  return (
    <form
      method="POST"
      name="comment-form"
      onSubmit={(e) => handleSubmit(e)}
      className="container-xl comment-form"
    >
      <h2 className="comment-head">
        نظرتان را {titleName && `درمورد ${titleName}`} بنویسید
      </h2>

      <label htmlFor="comment-textarea" className="comment-textarea-label">
        نظرات شما <b>*</b>
      </label>
      <textarea
        name="comment-textarea"
        value={formData.user_comment}
        id="comment-textarea"
        className="comment-textarea"
        rows={8}
        placeholder="نظر خود را بنویسید..."
        onChange={(e) => handleChange(e)}
      ></textarea>
      {errors.user_comment && (
        <p className="comment-err-msg">{errors.user_comment}</p>
      )}
      <input
        type="submit"
        value="ارسال"
        className="btn comment-send-btn"
        name="comment-send-btn"
      />
      {loginMessage && (
        <AlertMessage
          type={"error"}
          message={"برای ثبت نظر ابتدا باید وارد حساب کاربری خود شوید ❌"}
        />
      )}
      {successMessage && (
        <AlertMessage type={"success"} message={successMessage} />
      )}
      {errMessage && <AlertMessage type={"error"} message={errMessage} />}
    </form>
  );
};

export default CreateComments;
