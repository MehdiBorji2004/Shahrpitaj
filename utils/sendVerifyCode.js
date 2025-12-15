require("dotenv").config();
const axios = require("axios");

const sendVerifyCode = async (mobile, code) => {
  const res = await axios.post(
    "https://api.sms.ir/v1/send/verify",
    {
      mobile,
      templateId: process.env.SMSIR_TEMPLATE_ID || Number(750316),
      parameters: [{ name: "CODE", value: code }],
    },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-api-key":
          process.env.SMSIR_API_KEY ||
          "n9U1qClMNYViLL2qqbtxCpn41s1TcKIyqZOls2vT1WLzismD",
      },
    }
  );

  console.log(res);
  console.log("data:", mobile, code);
};

module.exports = { sendVerifyCode };
