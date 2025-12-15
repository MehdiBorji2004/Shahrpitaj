import * as Yup from "yup";

const otpSchema = Yup.object().shape({
  otp: Yup.string()
    .min(6, "کد تایید باید حداقل 6 رقم باشد*")
    .max(6, "کد تایید باید 6 رقم باشد*")
    .required("کد تایید الزامی است*"),
});

export default otpSchema;
