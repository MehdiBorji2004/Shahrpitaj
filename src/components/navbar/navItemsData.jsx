import * as FaIcons from "react-icons/fa";
import * as BsIcons from "react-icons/bs";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import { RiAccountCircleFill } from "react-icons/ri";
import { FiLogIn } from "react-icons/fi";
import { TbLayoutDashboardFilled } from "react-icons/tb";

// sidebarData.jsx
// This file contains the sidebar data for the header navigation
// Each item has a title, path, icon, and class name for styling
const navItemsData = [
  {
    id: 1,
    title: "صفحه اصلی",
    path: "/",
    icon: <AiIcons.AiFillHome />,
    cName: "header-nav-link",
  },
  {
    id: 2,
    title: "خدمات",
    path: "/services",
    icon: <BsIcons.BsScissors />,
    cName: "header-nav-link",
    dropIcon: <FaIcons.FaAngleDown />,
  },
  {
    id: 3,
    title: "درباره ما",
    path: "/about",
    icon: <IoIcons.IoIosInformationCircle />,
    cName: "header-nav-link",
  },
  {
    id: 4,
    title: "تماس با ما",
    path: "/contact",
    icon: <FaIcons.FaPhone />,
    cName: "header-nav-link",
  },
  {
    id: 5,
    title: "ورود | ثبت نام",
    path: "/signup",
    icon: <FiLogIn />,
    cName: "header-nav-link",
  },
  {
    id: 6,
    title: "پنل کاربری",
    path: "/auth/my-panel",
    icon: <RiAccountCircleFill />,
    cName: "header-nav-link",
  },
  {
    id: 7,
    title: "داشبورد",
    path: "/admin/panel",
    icon: <TbLayoutDashboardFilled />,
    cName: "header-nav-link",
  },
];

export default navItemsData;
