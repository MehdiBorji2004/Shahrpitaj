import * as Yup from "yup";

const commentSchema = Yup.object().shape({
  user_comment: Yup.string().trim().required("ارسال نظر خالی مجاز نیست !"),
});

export default commentSchema;
