import * as Yup from "yup";

const reservationSchema = Yup.object().shape({
  service_type: Yup.string().required("حداقل یکی از خدمات را انتخاب کنید!"),
  servicer_name: Yup.string().required(
    "حداقل یکی از خدمات دهنده ها را انتخاب کنید!"
  ),
  service_price: Yup.string(),
  date: Yup.object().required("باید یک تاریخ را برای رزرو نوبت انتخاب کنید!"),
  time: Yup.string().required(" باید یک زمان را برای رزرو نوبت انتخاب کنید!"),
  price: Yup.number(),
});

export default reservationSchema;
