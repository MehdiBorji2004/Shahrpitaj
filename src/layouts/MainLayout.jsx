import { useEffect, useState } from "react";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";
import BottomNavigation from "../components/bottom-navigation/BottomNavigation";

const MainLayout = ({ children }) => {
  const [isMobileSize, setIsMobileSize] = useState(false);
  const [isFixed, setIsFixed] = useState(false);

  const handleResize = () => {
    if (window.innerWidth < 576) {
      setIsMobileSize(true);
    } else {
      setIsMobileSize(false);
    }
  };

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setIsFixed(true);
    } else {
      setIsFixed(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();

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
