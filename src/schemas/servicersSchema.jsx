import * as Yup from "yup";

const servicersSchema = Yup.object().shape({
  first_name: Yup.string()
    .min(3, "نام خدمات دهنده باید حداقل 3 حرف باشد*")
    .max(20, "نام خانوادگی خدمات دهنده نباید بیشتر از 20 حرف باشد*")
    .trim()
    .required("نام خدمات دهنده الزامی است*"),
  last_name: Yup.string()
    .min(3, " نام خانوادگی خدمات دهنده باید حداقل 3 حرف باشد*")
    .max(20, "نام خانوادگی خدمات دهنده نباید بیشتر از 20 حرف باشد*")
    .trim()
    .required("نام خانوادگی خدمات دهنده الزامی است*"),
  age: Yup.number()
    .min(0, "سن خدمات دهنده نمی‌تواند منفی باشد*")
    .max(100, "سن خدمات دهنده نمی‌تواند بیشتر از 100 باشد*")
    .required("سن خدمات دهنده الزامی است*"),
  role: Yup.string()
    .min(3, " نقش خدمات دهنده باید حداقل 3 حرف باشد*")
    .max(20, "نقش خدمات دهنده نباید بیشتر از 20 حرف باشد*")
    .trim()
    .required("نقش خدمات دهنده الزامی است*"),
  experience: Yup.string().required("تجربه کاری خدمات دهنده الزامی است*"),
  specialty: Yup.string().required("تخصص خدمات دهنده الزامی است*"),
});

export default servicersSchema;
