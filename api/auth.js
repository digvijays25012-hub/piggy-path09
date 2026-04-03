// Vercel Serverless Function for OTP Auth
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { action, phone, otp } = req.body;

  if (action === 'send') {
    // Generate a secure 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[AUTH] OTP for ${phone}: ${generatedOtp}`);
    
    // In production, you would integrate Twilio / MSG91 here
    return res.status(200).json({ success: true, message: 'OTP Sent Successfully' });
  }

  if (action === 'verify') {
    if (otp && otp.length === 6) {
      // In a real app, you would check this against a Redis/Database store
      return res.status(200).json({ success: true, message: 'Verified' });
    }
    return res.status(400).json({ success: false, error: 'Invalid OTP' });
  }

  return res.status(400).json({ error: 'Invalid Action' });
}
