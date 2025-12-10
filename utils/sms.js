require("dotenv").config();
import axios from "axios";

export const sendVerifyCode = async (phone, code) => {
  try {
    const response = await axios.post(
      "https://api.sms.ir/v1/send/verify",
      {
        mobile: phone,
        templateId: 123456, // آیدی قالب تاییدیه در پنل
        parameters: [{ name: "CODE", value: code }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.SMSIR_API_KEY,
        },
      }
    );

    console.log("SMS Sent:", response.data);
    return true;
  } catch (error) {
    console.log("SMS Error:", error.response?.data || error.message);
    return false;
  }
};
