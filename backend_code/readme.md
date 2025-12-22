require('dotenv').config(); // For securely loading environment variables

const twilio = require('twilio');

// Your Twilio Account SID and Auth Token (store in environment variables for security)
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = new twilio(accountSid, authToken);

async function sendSMS(toPhoneNumber, messageBody) {
  try {
    const message = await client.messages.create({
      body: messageBody,
      to: toPhoneNumber,
      from: process.env.TWILIO_PHONE_NUMBER // Your Twilio phone number
    });
    console.log(`SMS sent successfully! Message SID: ${message.sid}`);
  } catch (error) {
    console.error('Error sending SMS:', error);
  }
}

// Example usage:
sendSMS('+1234567890', 'Hello from your Node.js application!');