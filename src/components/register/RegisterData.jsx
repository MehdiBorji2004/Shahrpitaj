import * as HiIcons from "react-icons/hi2";

const RegisterData = [
  {
    type: "signup",
    form_text: "قبلا ثبت نام کرده اید ؟",
    path: "/login",
    inputsData: [
      {
        name: "first_name",
        type: "text",
        placeholder: "نام",
        minLength: 2,
        maxLength: 15,
        icon: <HiIcons.HiOutlineUser />,
      },
      {
        name: "last_name",
        type: "text",
        placeholder: "نام خانوادگی",
        minLength: 4,
        maxLength: 15,
        icon: <HiIcons.HiOutlineUserGroup />,
      },
      {
        name: "phone",
        type: "tel",
        maxLength: 11,
        placeholder: "شماره موبایل",
        icon: <HiIcons.HiOutlinePhone />,
      },
    ],
  },
  {
    type: "login",
    form_text: "حساب کاربری ندارید ؟",
    path: "/signup",
    inputsData: [
      {
        name: "phone",
        type: "tel",
        maxLength: 11,
        placeholder: "شماره موبایل",
        icon: <HiIcons.HiOutlinePhone />,
      },
    ],
  },
  {
    type: "verify-signup",
    form_text: "کد ارسال شده را وارد کنید.",
    inputsData: [
      {
        name: "otp",
        type: "tel",
        maxLength: 6,
      },
    ],
  },
  {
    type: "verify-login",
    form_text: "کد ارسال شده را وارد کنید.",
    inputsData: [
      {
        name: "otp",
        type: "tel",
        maxLength: 6,
      },
    ],
  },
];
export default RegisterData;
