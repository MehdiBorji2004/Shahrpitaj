import { useEffect, useRef, useState } from "react";
import { IoArrowUpCircleOutline } from "react-icons/io5";
import "./scroll-top.css";

const ScrollTop = () => {
  const scrollRef = useRef(null);
  const [isActive, setIsActive] = useState(false);

  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const showScroller = () => {
    if (window.scrollY > 50) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  };

  useEffect(() => {
    scrollRef.current?.addEventListener("click", handleScrollTop);
    window.addEventListener("scroll", showScroller);

    return () => {
        scrollRef.current?.removeEventListener("click", handleScrollTop);
        window.removeEventListener("scroll", showScroller);
    }
  }, []);

  return (
    <>
      <div
        ref={scrollRef}
        className={isActive ? "scroll-top" : "hide-scroller"}
      >
        <IoArrowUpCircleOutline />
      </div>
    </>
  );
};

export default ScrollTop;
