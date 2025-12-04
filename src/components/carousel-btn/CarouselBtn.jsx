import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useSwiper } from "swiper/react";
import "./carousel-btn.css";

const CarouselBtn = ({ direction }) => {
  const swiper = useSwiper();

  const changeSlide = (dir) => {
    if (swiper) {
      swiper.autoplay.stop();
      if (dir === "next") {
        swiper.slideNext();
      } else {
        swiper.slidePrev();
      }
    }
    setTimeout(() => {
      if (!swiper.destroyed) {
        swiper.autoplay.start();
      }
    }, 10);
  };

  return (
    <button
      className={`carousel-btn ${
        direction === "next" ? "next-btn" : "prev-btn"
      }`}
      onClick={() => changeSlide(direction)}
    >
      {direction === "next" ? <IoIosArrowBack /> : <IoIosArrowForward />}
    </button>
  );
};

export default CarouselBtn;
