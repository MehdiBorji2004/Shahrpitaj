import * as Yup from "yup";

const otpSchema = Yup.object().shape({
  otp: Yup.string()
    .min(4, "کد تایید باید حداقل ۴ رقم باشد*")
    .max(4, "کد تایید باید ۴ رقم باشد*")
    .required("کد تایید الزامی است*"),
});

export default otpSchema;
