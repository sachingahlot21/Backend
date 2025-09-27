const twilio = require('twilio');
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.MESSAGING_SERVICE_ID
const client = twilio(accountSid, authToken);

async function sendOTP(phone, otp, username) {
  try {
    await client.messages.create({
      body: `Your OTP verification  for user ${username} is: ${otp}. This OTP is valid for 10 minutes.`,
      messagingServiceSid: messagingServiceSid,
      to: phone
    });
    return true;
  } catch (error) { 
    console.error('SMS sending failed:', error);
    return false;
  }
}

module.exports = {
  sendOTP
};