import * as Yup from "yup";

// Yup validation schema for the registration form
// It checks if the first name, last name, and phone number are valid
const signupSchema = Yup.object().shape({
  first_name: Yup.string()
    .min(3, "نام باید حداقل 3 حرف باشد*")
    .max(15, "نام نباید بیشتر از 15 حرف باشد*")
    .trim()
    .required("نام الزامی است*"),
  last_name: Yup.string()
    .min(3, "نام خانوادگی باید حداقل 3 حرف باشد*")
    .max(15, "نام خانوادگی نباید بیشتر از 15 حرف باشد*")
    .trim()
    .required("نام خانوادگی الزامی است*"),
  phone: Yup.string()
    .min(11, "شماره موبایل حداقل باید 11 رقم باشد*")
    .required("شماره موبایل الزامی است*")
    .matches(/^09[0-9]{9}$/, "شماره موبایل باید با 09 شروع شود و 11 رقم باشد*"),
});

const loginSchema = Yup.object().shape({
  phone: Yup.string()
    .min(11, "شماره موبایل حداقل باید 11 رقم باشد*")
    .required("شماره موبایل الزامی است*")
    .matches(/^09[0-9]{9}$/, "شماره موبایل باید با 09 شروع شود و 11 رقم باشد*"),
});

export default { signupSchema, loginSchema };
