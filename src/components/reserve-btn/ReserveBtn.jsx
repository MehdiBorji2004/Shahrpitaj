import "./reserveBtn.css";
import { useNavigate } from "react-router-dom";
import * as FaIcons from "react-icons/fa6";

const ReserveBtn = ({ value }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate("/reserve");
  };

  return (
    <button className="reserve-btn" onClick={handleClick}>
      {value ? value : " رزرو نوبت"}
      <FaIcons.FaArrowLeft />
    </button>
  );
};

export default ReserveBtn;
