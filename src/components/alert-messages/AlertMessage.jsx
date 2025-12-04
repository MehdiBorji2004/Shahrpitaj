import { useState, useEffect } from "react";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiAlertTriangle,
  FiX,
} from "react-icons/fi";
import "./alert-message.css";

const AlertMessage = ({
  type = "success",
  message,
  title,
  onClose,
  duration = 2000,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const iconMap = {
    success: <FiCheckCircle className="alert-icon" />,
    error: <FiAlertCircle className="alert-icon" />,
    warning: <FiAlertTriangle className="alert-icon" />,
    info: <FiInfo className="alert-icon" />,
  };

  return (
    <div
      className={`alert-message-container ${type} ${
        !isVisible ? "hide-alert" : ""
      }`}
    >
      {iconMap[type]}
      <div className="alert-content">
        {title && <p className="alert-title">{title}</p>}
        <p className={title ? "alert-description" : ""}>{message}</p>
      </div>
      <button className="alert-close-btn" onClick={() => setIsVisible(false)}>
        <FiX />
      </button>
      <div className="alert-progress"></div>
    </div>
  );
};

export default AlertMessage;
