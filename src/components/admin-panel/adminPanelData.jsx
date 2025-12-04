import * as HiIcons from "react-icons/hi2";
import * as FaIcons from "react-icons/fa";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { RiAdminFill, RiImageAiLine } from "react-icons/ri";
import { CgDetailsMore } from "react-icons/cg";
import { MdOutlineLockPerson, MdAttachMoney, MdAccountCircle } from "react-icons/md";
import { FaComments } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5";
import { AiFillInstagram, AiFillSetting } from "react-icons/ai";
import { FaScissors } from "react-icons/fa6";


const panelStats = [
  {
    title: "کل کاربران",
    dataKey: "users",
    icon: <HiIcons.HiUsers />,
    bgColor: "#98e1ff",
    iconColor: "#2094f3",
  },
  {
    title: "رزرو های فعال",
    dataKey: "activeReserves",
    icon: <HiIcons.HiClipboardDocumentList />,
    bgColor: "#81C784",
    iconColor: "#43A047",
  },
  {
    title: "رزرو های انجام شده",
    dataKey: "doneReserves",
    icon: <HiIcons.HiCheckBadge />,
    bgColor: "#FFF176",
    iconColor: "#FFD600",
  },
  {
    title: "درآمد کل",
    dataKey: "totalRevenue",
    icon: <HiIcons.HiCurrencyDollar />,
    bgColor: "#FF8A65",
    iconColor: "#F4511E",
  },
];

const usersStats = [
  {
    title: "کل کاربران",
    dataKey: "totalUsers",
    icon: <HiIcons.HiUsers />,
    bgColor: "#98e1ff",
    iconColor: "#2094f3",
    type: "total",
  },
  {
    title: "کاربران فعال",
    dataKey: "activeUsers",
    icon: <HiIcons.HiMiniCheckCircle />,
    bgColor: "#81C784",
    iconColor: "#43A047",
    type: "active",
  },
  {
    title: "کاربران غیرفعال",
    dataKey: "inactiveUsers",
    icon: <IoCloseCircle />,
    bgColor: "#FF8A65",
    iconColor: "#F4511E",
    type: "inactive",
  },
  {
    title: "کاربران جدید",
    dataKey: "newUsers",
    icon: <HiIcons.HiUser />,
    bgColor: "#FFF176",
    iconColor: "#FFD600",
    type: "new",
  },
];

const reservesStats = [
  {
    title: "کل رزرو ها",
    dataKey: "totalReserves",
    icon: <HiIcons.HiClipboardDocumentList />,
    bgColor: "#98e1ff",
    iconColor: "#2094f3",
    type: "total",
  },
  {
    title: "رزرو های فعال",
    dataKey: "activeReserves",
    icon: <HiIcons.HiMiniCheckCircle />,
    bgColor: "#81C784",
    iconColor: "#43A047",
    type: "active",
  },
  {
    title: "رزرو های انجام شده",
    dataKey: "doneReserves",
    icon: <HiIcons.HiCheckBadge />,
    bgColor: "#FFF176",
    iconColor: "#FFD600",
    type: "done",
  },
  {
    title: "رزرو های کنسل شده",
    dataKey: "canceledReserves",
    icon: <IoCloseCircle />,
    bgColor: "#FF8A65",
    iconColor: "#F4511E",
    type: "canceled",
  },
];

const sidebarData = [
  {
    title: "داشبورد",
    icon: <TbLayoutDashboardFilled />,
  },
  {
    title: "مدیریت رزرو ها",
    icon: <HiIcons.HiClipboardDocumentList />,
  },
  {
    title: "مدیریت کاربران ",
    icon: <HiIcons.HiUserGroup />,
  },
  {
    title: "مدیریت ادمین ها ",
    icon: <RiAdminFill />,
  },
  {
    title: "مدیریت خدمات",
    icon: <FaScissors />,
  },
  {
    title: "مدیریت خدمات دهنده",
    icon: <HiIcons.HiUser />,
  },
  {
    title: "مدیریت زمان های رزرو",
    icon: <HiIcons.HiClock />,
  },
  {
    title: "مدیریت کامنت ها",
    icon: <FaComments />,
  },
  {
    title: "تنظیمات عمومی",
    icon: <AiFillSetting />,
  },
  {
    title: "پنل کاربری من",
    icon: <MdAccountCircle />,
  },
];

const panelReservesInfo = [
  {
    title: "لیست رزرو های فعال",
    notReserveText: "هیچ رزرو فعالی وجود ندارد!",
    dataKey: "activeReserves",
    icon: <HiIcons.HiClipboardDocumentList />,
    color: "#43A047",
  },
  {
    title: "لیست رزرو های انجام شده",
    notReserveText: "هیچ رزرو انجام شده ای وجود ندارد!",
    dataKey: "doneReserves",
    icon: <HiIcons.HiCheckBadge />,
    color: "#FFD600",
  },
];

const startDateItems = [
  { name: "امروز" },
  { name: "دیروز" },
  { name: "هفته قبل" },
  { name: "ماه قبل" },
  { name: "کل اطلاعات" },
];
const endDateItems = [
  { name: "امروز" },
  { name: "فردا" },
  { name: "هفته بعد" },
  { name: "ماه بعد" },
  { name: "کل اطلاعات" },
];

const servicesTableData = [
  { name: "نام خدمات" },
  { name: "جزئیات خدمات" },
  { name: "هزینه خدمات" },
  { name: "عکس خدمات" },
  { name: "نمونه کار" },
  { name: "حذف خدمات" },
];

const servicesInputData = [
  {
    type: "text",
    placeholder: "نام خدمات",
    name: "serviceName",
    minLength: 3,
    maxLength: 20,
    icon: <HiIcons.HiPencilSquare />,
  },
  {
    type: "text",
    placeholder: "جزئیات خدمات",
    name: "serviceDetails",
    minLength: 20,
    maxLength: 100000,
    icon: <CgDetailsMore />,
  },
  {
    type: "number",
    placeholder: "هزینه خدمات",
    name: "servicePrice",
    minLength: 5,
    maxLength: 8,
    icon: <MdAttachMoney />,
  },
];

const servicersInputData = [
  {
    type: "text",
    placeholder: "نام",
    name: "first_name",
    minLength: 3,
    maxLength: 20,
    icon: <HiIcons.HiOutlineUser />,
  },
  {
    type: "text",
    placeholder: "نام خانوادگی",
    name: "last_name",
    minLength: 3,
    maxLength: 20,
    icon: <HiIcons.HiOutlineUser />,
  },
  {
    type: "number",
    placeholder: "سن",
    name: "age",
    minLength: 2,
    maxLength: 2,
    icon: <HiIcons.HiOutlineUser />,
  },
  {
    type: "text",
    placeholder: "نقش",
    name: "role",
    minLength: 3,
    maxLength: 20,
    icon: <MdOutlineLockPerson />,
  },
  {
    type: "text",
    placeholder: "تجربه کاری",
    name: "experience",
    minLength: 2,
    maxLength: 20,
    icon: <MdOutlineLockPerson />,
  },
  {
    type: "text",
    placeholder: "تخصص",
    name: "specialty",
    minLength: 3,
    maxLength: 20,
    icon: <MdOutlineLockPerson />,
  },
];

const reserveTimesInputs = [
  {
    label: "ساعت شروع",
    type: "text",
    placeholder: "مثلا 10",
    name: "startHour",
    // icon: <HiIcons.HiOutlineClock />,
  },
  {
    label: "ساعت پایان",
    type: "text",
    placeholder: "مثلا 20",
    name: "endHour",
    // icon: <HiIcons.HiOutlineClock />,
  },
  {
    label: "مدت زمان خدمات",
    type: "text",
    placeholder: "مثلا 30",
    name: "duration",
    // icon: <HiIcons.HiOutlineClock />,
  },
];

const generalSettingsData = [
  {
    title: "اطلاعات پایه سایت",
    dataKey: "baseInfo",
    icon: <FaIcons.FaGlobe className="settings-section-icon" />,
    inputsData: [
      {
        inputLabel: "نام سایت",
        inputDataKey: "siteName",
        className: "setting-input",
        type: "text",
        placeholder: "نام سایت",
      },
      {
        inputLabel: "درباره سایت",
        inputDataKey: "siteDescription",
        className: "setting-input",
        type: "textarea",
        placeholder: "درباره سایت",
        rows: 3,
      },
    ],
  },
  {
    title: "اطلاعات تماس",
    dataKey: "contactInfo",
    icon: <FaIcons.FaPhone className="settings-section-icon" />,
    inputsData: [
      {
        inputLabel: "تلفن همراه",
        inputDataKey: "phone",
        className: "setting-input",
        type: "text",
        placeholder: "شماره تلفن همراه",
      },
      {
        inputLabel: "آدرس",
        inputDataKey: "address",
        className: "setting-input",
        type: "textarea",
        placeholder: "آدرس",
        rows: 3,
      },
    ],
  },
  {
    title: "شبکه های اجتماعی",
    dataKey: "socialMediaInfo",
    icon: <AiFillInstagram className="settings-section-icon" />,
    inputsData: [
      {
        inputLabel: "اینستاگرام",
        inputDataKey: "instagram",
        className: "setting-input",
        type: "url",
        placeholder: "لینک اینستاگرام",
      },
      {
        inputLabel: "واتساپ",
        inputDataKey: "whatsApp",
        className: "setting-input",
        type: "url",
        placeholder: "لینک واتساپ",
      },
      {
        inputLabel: "تلگرام",
        inputDataKey: "telegram",
        className: "setting-input",
        type: "url",
        placeholder: "لینک تلگرام",
      },
    ],
  },
  {
    title: "تنظیمات سیستمی",
    dataKey: "systemInfo",
    icon: <AiFillSetting className="settings-section-icon" />,
    inputsData: [
      {
        inputLabel: "حالت تعمیرات",
        inputDataKey: "maintenanceMode",
        type: "checkbox",
        className: "setting-input",
        placeholder: "حالت تعمیرات",
        description:
          "در این حالت سایت برای کاربران عادی غیرقابل دسترس خواهد بود",
      },
      {
        inputLabel: "فعال بودن رزرو آنلاین",
        inputDataKey: "allowOnlineReservation",
        type: "checkbox",
        className: "setting-input",
        placeholder: "فعال بودن رزرو آنلاین",
        description:
          "با غیرفعال کردن این گزینه، کاربران قادر به رزرو آنلاین نخواهند بود",
      },
    ],
  },
];

export {
  panelStats,
  usersStats,
  reservesStats,
  startDateItems,
  endDateItems,
  sidebarData,
  panelReservesInfo,
  servicesTableData,
  servicesInputData,
  servicersInputData,
  reserveTimesInputs,
  generalSettingsData,
};
