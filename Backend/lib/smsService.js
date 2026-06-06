import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export const sendSMS = async (to, message) => {
  if (!client) {
    console.log("Twilio not configured. SMS would be sent:", { to, message });
    return { success: true, message: "SMS not configured (mocked)" };
  }

  try {
    const response = await client.messages.create({
      body: message,
      from: fromNumber,
      to: to,
    });

    console.log("SMS sent successfully:", response.sid);
    return { success: true, sid: response.sid };
  } catch (error) {
    console.error("Error sending SMS:", error);
    return { success: false, error: error.message };
  }
};
