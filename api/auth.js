import twilio from 'twilio';

// Load credentials from Environment Variables (set these in Vercel Dashboard)
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { action, phone, otp } = req.body;

  if (action === 'send') {
    // Generate a secure 6-digit random code
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Format number for International SMS (e.g., +91)
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

    try {
      // Actually Send the SMS using Twilio
      await client.messages.create({
        body: `Your Piggypath Trading Account Code: ${generatedOtp}. Do not share this with anyone!`,
        from: twilioNumber,
        to: formattedPhone
      });

      console.log(`[AUTH] SMS Dispatched to ${formattedPhone}`);
      
      // We return success to UI. (In a real DB app, we'd store the OTP to 'verify' it later)
      return res.status(200).json({ success: true, message: 'SMS Sent Successfully' });
    } catch (err) {
      console.error("[AUTH ERROR] Twilio Failed:", err.message);
      return res.status(500).json({ success: false, error: 'SMS Dispatch Failed. Please check Twilio configuration.' });
    }
  }

  if (action === 'verify') {
    // For this live demo, any 6-digit code is accepted as 'Verified' once sent.
    // In production, we'd compare this to the stored one in Redis/Database.
    if (otp && otp.length === 6) {
      return res.status(200).json({ success: true, message: 'Verified' });
    }
    return res.status(400).json({ success: false, error: 'Invalid OTP' });
  }

  return res.status(400).json({ error: 'Invalid Action' });
}
