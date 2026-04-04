// In-memory store for demo (In production, use Redis/Upstash for Vercel)
const otpStore = new Map();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { action, phone, otp } = req.body;

  if (!phone) return res.status(400).json({ error: 'Phone number required' });

  // 1. SEND ACTION
  if (action === 'send') {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with an expiry (5 minutes) and 0 attempts
    otpStore.set(phone, {
      code,
      expires: Date.now() + 5 * 60 * 1000,
      attempts: 0
    });

    console.log(`[SECURITY] OTP for ${phone}: ${code} (Expires in 5m)`);
    
    // Simulate/Run Twilio logic here...
    return res.status(200).json({ success: true, message: 'OTP Sent' });
  }

  // 2. VERIFY ACTION (Hardened against Brute Force)
  if (action === 'verify') {
    const record = otpStore.get(phone);

    if (!record) {
      return res.status(400).json({ success: false, error: 'No OTP requested for this number' });
    }

    // BRUTE FORCE PROTECTION: Limit to 3 attempts
    if (record.attempts >= 3) {
      otpStore.delete(phone); // Lock the number/Session
      return res.status(429).json({ success: false, error: 'Too many attempts. Please request a new OTP.' });
    }

    // EXPIRATION CHECK
    if (Date.now() > record.expires) {
      otpStore.delete(phone);
      return res.status(400).json({ success: false, error: 'OTP has expired' });
    }

    // ACTUAL VERIFICATION
    if (otp === record.code) {
      otpStore.delete(phone); // Burn the OTP on use
      return res.status(200).json({ success: true, message: 'Verified' });
    } else {
      // Increment attempt counter
      record.attempts += 1;
      otpStore.set(phone, record);
      
      return res.status(401).json({ 
        success: false, 
        error: `Incorrect code. ${3 - record.attempts} attempts remaining.` 
      });
    }
  }

  return res.status(400).json({ error: 'Invalid Action' });
}
