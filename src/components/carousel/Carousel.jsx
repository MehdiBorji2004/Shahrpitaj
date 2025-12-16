import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCoverflow,
  Pagination,
  Navigation,
  Autoplay,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import AlertMessage from "../alert-messages/AlertMessage";
import UseAdminData from "../../hooks/UseAdminData";
import "./carousel.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Spinner } from "react-bootstrap";

const Carousel = () => {
  const [repeated_services, setRepeated_services] = useState([]);
  const { getServices, servicesList, formatPrice, errors, setErrors } =
    UseAdminData();
  const [isLoading, setIsLoading] = useState(true);
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await getServices();
      } catch (error) {
        setErrors("خطا در بارگذاری خدمات");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (servicesList && servicesList.length > 0) {
      const repeated = [...servicesList, ...servicesList];
      setRepeated_services(repeated);
      setErrors(null);
    }
  }, [servicesList]);

  if (isLoading) {
    return (
      <div className="services-loading">
        <div className="loading-spinner"></div>
        <p>در حال بارگذاری خدمات...</p>
      </div>
    );
  }

  return (
    <div className="services-page">
      {errors && <AlertMessage type="error" message={errors} />}

      {/* کاروسل خدمات */}
      <section className="services-carousel-section">
        <div className="container-xl">
          <div className="section-header">
            <h2>خدمات ویژه ما</h2>
            <p>با کلیک بر روی هر خدمت، اطلاعات کامل را مشاهده کنید</p>
          </div>

          <div className="carousel-container">
            <Swiper
              effect={"coverflow"}
              grabCursor={true}
              centeredSlides={true}
              loop={true}
              slidesPerView={"auto"}
              coverflowEffect={{
                rotate: 0,
                stretch: 0,
                depth: 100,
                modifier: 2.5,
                slideShadows: true,
              }}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              navigation={{
                prevEl: navigationPrevRef.current,
                nextEl: navigationNextRef.current,
              }}
              modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
              className="services-swiper"
              breakpoints={{
                320: {
                  slidesPerView: 1,
                },
                768: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
                1200: {
                  slidesPerView: 3.5,
                },
              }}
            >
              {repeated_services.length > 0 ? (
                repeated_services.map((service, index) => (
                  <SwiperSlide key={index} className="service-slide">
                    <div className="service-card">
                      <Link
                        to={service.servicePath}
                        className="service-card-link"
                      >
                        <div className="service-image-container">
                          <img
                            src={
                              service.imageUrl ||
                              "/images/site-logo/site-logo.png"
                            }
                            alt={service.serviceName}
                            className="service-image"
                          />
                        </div>
                        <div className="service-content">
                          <h3 className="service-name">
                            {service.serviceName}
                          </h3>
                          <p className="service-description">
                            {service.serviceDetails}
                          </p>
                          <div className="service-price">
                            {formatPrice(service.servicePrice)} تومان
                          </div>
                          <div className="service-cta">
                            <span className="cta-text">رزرو این خدمت</span>
                            <FaIcons.FaArrowLeft className="cta-icon" />
                          </div>
                        </div>
                      </Link>
                    </div>
                  </SwiperSlide>
                ))
              ) : (
                <div className="no-services" style={{ flexDirection: "row" }}>
                  <Spinner
                    animation="grow"
                    role="status"
                    variant="primary"
                    size="sm"
                  ></Spinner>
                  <p>در حال دریافت خدمات ...</p>
                </div>
              )}
            </Swiper>

            <div className="carousel-navigation">
              <button ref={navigationPrevRef} className="nav-btn prev-btn">
                <IoIosArrowForward />
              </button>
              <button ref={navigationNextRef} className="nav-btn next-btn">
                <IoIosArrowBack />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Carousel;
