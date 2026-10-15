import { useEffect, useState } from "react";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";
import BottomNavigation from "../components/bottom-navigation/BottomNavigation";

const MainLayout = ({ children }) => {
  const [isMobileSize, setIsMobileSize] = useState(window.innerWidth <= 430);
  const [isFixed, setIsFixed] = useState(false);

  const handleResize = () => {
    if (window.innerWidth <= 430) {
      setIsMobileSize(true);
    } else {
      setIsMobileSize(false);
    }
  };

  const handleScroll = () => {
    if (window.scrollY >= 50) {
      setIsFixed(true);
    } else {
      setIsFixed(false);
    }
  };

  useEffect(() => {
    handleResize();
    handleScroll();

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <Header isFixed={isFixed} isMobileSize={isMobileSize} />

      <main> {children} </main>

      {isMobileSize && <BottomNavigation />}

      <Footer />
    </>
  );
};

export default MainLayout;
