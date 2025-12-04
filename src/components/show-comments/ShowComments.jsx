import { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "./show-comments.css";
import CreateCommnets from "../create-comments/CreateComments";
import AlertMessage from "../alert-messages/AlertMessage";
import UseAdminData from "../../hooks/UseAdminData";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Comments = () => {
  const {
    token,
    getComments,
    getGeneralSettingsInfo,
    commentsList,
    generalSettingsInfo,
  } = UseAdminData();
  const [isClicked, setIsClicked] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const swiperRef = useRef(null);
  const repeatedComments = [...commentsList, ...commentsList];
  const data = generalSettingsInfo[0];
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);

  let alertTimerID;
  const handleClick = () => {
    if (token) {
      setIsClicked(true);
    } else {
      setShowLoginAlert(true);
    }

    alertTimerID = setTimeout(() => {
      setShowLoginAlert(false);
    }, 4000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getComments();
        await getGeneralSettingsInfo();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();

    return () => {
      if (alertTimerID) {
        clearTimeout(alertTimerID);
      }
    };
  }, []);

  return (
    <section className="container comments-container">
      <h1 className="comments-title">
        دیدگاه مشتریان <span>{data?.baseInfo?.siteName || "شهر پیتاژ"} </span>
      </h1>

      {repeatedComments && repeatedComments.length > 0 ? (
        <div className="horizontal-comments-container">
          <Swiper
            ref={swiperRef}
            modules={[Autoplay, Navigation]}
            grabCursor={true}
            centeredSlides={true}
            spaceBetween={20}
            slidesPerView={"auto"}
            autoplay={{
              delay: 3000,
              disableOnInteraction: true,
              pauseOnMouseEnter: true,
            }}
            speed={2000}
            loop={true}
            loopedSlides={repeatedComments.length}
            allowTouchMove={true}
            simulateTouch={true}
            touchRatio={1}
            touchAngle={45}
            shortSwipes={true}
            longSwipes={true}
            longSwipesRatio={0.1}
            longSwipesMs={300}
            followFinger={true}
            threshold={10}
            navigation={{
              prevEl: navigationPrevRef.current,
              nextEl: navigationNextRef.current,
            }}
            resistance={true}
            resistanceRatio={0.85}
            className="horizontal-comments-swiper"
            breakpoints={{
              0: {
                slidesPerView: 1,
                slidesPerGroup: 1,
                centeredSlides: false,
                spaceBetween: 12,
              },
              425: {
                slidesPerView: "auto",
                slidesPerGroup: 1,
                centeredSlides: true,
                spaceBetween: 13,
              },
              768: {
                slidesPerView: "auto",
                slidesPerGroup: 1,
                centeredSlides: true,
                spaceBetween: 20,
              },
            }}
            /* ensure grouping by single slide when using mousewheel / keyboard */
            slidesPerGroup={1}
          >
            {repeatedComments.map((item, index) => (
              <SwiperSlide key={index} className="comment-slide">
                <div className="comment-card">
                  <div className="user-comment-profile">
                    <img
                      className="user-comment-img"
                      src={item.user_profile || "/images/user-default-img.jpg"}
                      alt="img"
                    />
                    <div>
                      <p className="user-comment-name">
                        {item.user_firstName} {item.user_lastName}
                      </p>
                      <p className="user-comment-subname">
                        مشتری {data?.baseInfo?.siteName || "شهر پیتاژ"}{" "}
                      </p>
                    </div>
                  </div>
                  <div className="user-comment-text">
                    <p className="user-comment-date">
                      {item.createdAt.time} | {item.createdAt.solarDate}
                    </p>
                    <p className="user-comment">{item.user_comment}</p>
                  </div>
                  <div className="admin-reply-container">
                    <p>
                      پاسخ ادمین : {item.admin_reply || "پاسخی ثبت نشده است."}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
            <div className="carousel-navigation">
              <button ref={navigationPrevRef} className="nav-btn prev-btn">
                <IoIosArrowForward />
              </button>
              <button ref={navigationNextRef} className="nav-btn next-btn">
                <IoIosArrowBack />
              </button>
            </div>
          </Swiper>
        </div>
      ) : (
        <div className="no-comment-container">
          <div className={isClicked ? "hide-no-comment" : ""}>
            <p className="no-comment-text">هنوز هیچ دیدگاهی ثبت نشده است !</p>
            <button
              className="btn create-new-comment-btn"
              onClick={handleClick}
            >
              ایجاد دیدگاه
            </button>
          </div>
          {showLoginAlert && (
            <AlertMessage
              type={"error"}
              message={"برای ثبت دیدگاه ابتدا باید وارد حساب کاربری خود شوید !"}
            />
          )}
          {isClicked && (
            <CreateCommnets
              titleName={data?.baseInfo?.siteName || "شهر پیتاژ"}
            />
          )}
        </div>
      )}
    </section>
  );
};

export default Comments;
