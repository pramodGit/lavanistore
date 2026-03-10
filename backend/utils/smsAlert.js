import axios from "axios";

const SMSALERT_API_KEY = process.env.SMSALERT_API_KEY;   // put your API key in env
const SMSALERT_SENDER_ID = process.env.SMSALERT_SENDER_ID; // e.g. "TXTLRT";

export async function sendSMS(to, message) {
  if (!to) {
    console.log("📵 No phone number, skipping SMS...");
    return;
  }

  try {
    const payload = {
      apikey: SMSALERT_API_KEY,
      sender: SMSALERT_SENDER_ID,
      mobileno: to,
      text: message,
    };

    const res = await axios.post("https://www.smsalert.co.in/api/push.json", payload);

    if (res.data && res.data.status === "success") {
      console.log(`✅ SMS sent to ${to}`);
      console.log("✅ SMS API response:", res.data);
    } else {
      console.log("⚠️ SMS API response:", res.data);
    }
  } catch (err) {
    // Use Axios error structure
    if (err.response) {
      console.error("❌ SMS sending failed, server responded:", err.response.data);
    } else if (err.request) {
      console.error("❌ SMS sending failed, no response received:", err.request);
    } else {
      console.error("❌ SMS sending failed:", err.message);
    }
  }
}
