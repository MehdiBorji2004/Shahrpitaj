import { useEffect, useRef, useState } from "react";
import UseAdminData from "../../../hooks/UseAdminData";
import "./manage-comments.css";
import { FaReply } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { FaComments } from "react-icons/fa";
import * as Yup from "yup";
import axios from "axios";
import AlertMessage from "../../alert-messages/AlertMessage";

const replySchema = Yup.object().shape({
  adminReply: Yup.string().trim().required("ارسال پاسخ خالی مجاز نیست!"),
});

const ManageComments = () => {
  const baseUrl = `${import.meta.env.VITE_BASE_URL}${
    import.meta.env.VITE_PORT
  }`;
  const { getComments, commentsList, errors, setErrors, token, role } =
    UseAdminData();
  const [activeReplyBox, setActiveReplyBox] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  let timeoutID = useRef(null);
  const [commentID, setCommentID] = useState(null);
  const [formData, setFormData] = useState({
    adminReply: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateFormData = async () => {
    try {
      const isValid = await replySchema.validate(formData, {
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
      if (!token || role !== "admin") return;

      const validateData = await validateFormData();
      if (validateData) {
        const res = await axios.post(
          `${baseUrl}/admin/reply-comment`,
          { formData, commentID },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.status === 200) {
          setSuccessMsg(res.data.message || "پاسخ شما با موفقیت ثبت شد ✅");
          setFormData((prev) => ({
            ...prev,
            adminReply: "",
          }));
          getComments();
          timeoutID.current = setTimeout(() => {
            setSuccessMsg("");
          }, 2000);
        }
      }
    } catch (error) {
      setErrors(error.response?.data?.message || "خطای سرور در ثبت پاسخ ❌");
      timeoutID.current = setTimeout(() => {
        setErrors("");
      }, 2000);
    }
  };

  const handleDeleteComment = async (commentID) => {
    try {
      if (!token || role !== "admin") return;
      const res = await axios.delete(`${baseUrl}/admin/delete-comment`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { commentID },
      });

      if (res.status === 200) {
        setSuccessMsg(res.data.message || "کامنت مورد نظر با موفقیت حذف شد ✅");
        getComments();
        timeoutID.current = setTimeout(() => {
          setSuccessMsg("");
        }, 2000);
      }
    } catch (error) {
      setErrors(error.response?.data?.message || "خطای سرور در حذف کامنت ❌");
      timeoutID.current = setTimeout(() => {
        setErrors("");
      }, 2000);
    }
  };

  useEffect(() => {
    getComments();

    return () => {
      if (timeoutID.current) clearTimeout(timeoutID.current);
    };
  }, []);

  return (
    <section className="panel-content">
      {successMsg && <AlertMessage type={"success"} message={successMsg} />}
      {/* {errors && <AlertMessage type={"error"} message={errors} />} */}
      <h3> مدیریت کامنت ها </h3>
      <div className="comments-count">
        <span>
          <FaComments />
        </span>
        <span>تعداد کل کامنت ها : {commentsList.length} عدد</span>
      </div>
      <div className="all-comments-container">
        {commentsList.map((comment, index) => {
          return (
            <div key={index} className="manage-comment-container">
              <div className="user-comment-wrapper">
                {/* user info */}
                <div className="user-info">
                  <div>
                    <div className="user-info-img">
                      <img
                        src={comment.user_profile || "/images/user-default-img.jpg"}
                        alt="img"
                      />
                    </div>
                    <div className="user-info-name">
                      <p>
                        {comment.user_firstName} {comment.user_lastName}
                      </p>
                      <p>{comment.createdAt.solarDate}</p>
                    </div>
                  </div>
                  <div className="manage-comments-btn">
                    {!comment.admin_reply && (
                      <div className="comment-btn reply">
                        <button
                          onClick={() => {
                            setActiveReplyBox(comment._id);
                            setCommentID(comment._id);
                          }}
                        >
                          <FaReply />
                        </button>
                      </div>
                    )}
                    <div className="comment-btn remove">
                      <button onClick={() => handleDeleteComment(comment._id)}>
                        <RxCross2 />
                      </button>
                    </div>
                  </div>
                </div>
                {/* user comment */}
                <div className="manage-user-comment">
                  <p>{comment.user_comment}</p>
                </div>
              </div>
              {/* admin reply */}
              {activeReplyBox === comment._id && !comment.admin_reply && (
                <form onSubmit={handleSubmit} className="reply-form">
                  <textarea
                    name="adminReply"
                    value={formData.adminReply}
                    onChange={handleChange}
                    rows={4}
                  ></textarea>
                  {errors.adminReply && (
                    <p className="reply-err-msg">{errors.adminReply}</p>
                  )}
                  <div className="">
                    <input type="submit" value={"ثبت پاسخ"} className="btn" />
                    <button
                      className="btn cancel-reply-btn"
                      onClick={() => setActiveReplyBox(null)}
                    >
                      لغو
                    </button>
                  </div>
                </form>
              )}
              {comment.admin_reply && (
                <div className="admin-reply-wrapper">
                  <div className="admin-info">
                    <div className="admin-info-img">
                      <img
                        src={
                          comment.admin_profile ||
                          "/images/team-img/team-default-img.png"
                        }
                        alt="img"
                      />
                    </div>
                    <div className="admin-info-name">
                      <p>
                        {comment.admin_firstName} {comment.admin_lastName}
                      </p>
                      <p> {comment.reply_date.date} </p>
                    </div>
                  </div>
                  <div className="admin-answer">
                    <p>{comment.admin_reply}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ManageComments;
