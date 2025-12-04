import Banner from "../components/banner/Banner";
import ShowComments from '../components/show-comments/ShowComments';
import Team from "../components/team/Team";
import WorkTime from "../components/workTime/WorkTime";
import ScrollTop from '../components/scroll-top/ScrollTop'
import MainLayout from "../layouts/MainLayout";
import Carousel from "../components/carousel/Carousel";

const HomePage = () => {
  return (
    <MainLayout>
      <Banner />
      <WorkTime />
      <Carousel />
      <Team />
      <ShowComments />
      <ScrollTop />
    </MainLayout>
  );
};

export default HomePage;