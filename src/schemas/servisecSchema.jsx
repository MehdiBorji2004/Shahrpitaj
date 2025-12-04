import * as Yup from "yup";

const servicersSchema = Yup.object().shape({
  serviceName: Yup.string()
    .min(3, "نام خدمات باید حداقل 3 حرف باشد*")
    .max(20, "نام خدمات نباید بیشتر از 20 حرف باشد*")
    .trim()
    .required("نام خدمات الزامی است*"),
  serviceDetails: Yup.string()
    .min(3, " جزئیات خدمات باید حداقل 20 حرف باشد*")
    .max(100000, "جزئیات خدمات نباید بیشتر از 100000 حرف باشد*")
    .trim()
    .required("جزئیات خدمات الزامی است*"),
  servicePrice: Yup.number().required("هزینه خدمات الزامی است*"),
});

export default servicersSchema;
