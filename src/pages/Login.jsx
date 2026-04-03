import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ArrowLeft, CheckCircle2, ShieldCheck, Timer } from 'lucide-react';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // 6-digit array
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const login = useStore(state => state.login);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (phone.length !== 10) return;
    
    setIsLoading(true);
    try {
      const resp = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', phone })
      });
      
      const data = await resp.json();
      if (data.success) {
        setStep(2);
        setTimer(30);
      }
    } catch (err) {
      console.error("Auth error", err);
    }
    setIsLoading(false);
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus move
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) return;

    setIsLoading(true);
    try {
      const resp = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', phone, otp: fullOtp })
      });
      
      const data = await resp.json();
      if (data.success) {
        login(phone);
      } else {
        alert("Invalid OTP");
      }
    } catch (err) {
      console.error("Verify error", err);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-8 pt-12 max-w-md mx-auto relative">
      {/* Dynamic Background Decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-50/50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

      <button 
        onClick={() => step === 1 ? navigate('/') : setStep(1)}
        className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-10 text-slate-400 active:scale-90 transition-transform"
      >
        <ArrowLeft size={20} />
      </button>

      <div className="mb-12">
        <div className="w-16 h-16 bg-[#FF6B6B] rounded-[22px] flex items-center justify-center mb-6 shadow-2xl shadow-red-100 transform -rotate-6">
           <ShieldCheck size={32} className="text-white" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
          {step === 1 ? 'Verify Identity' : 'Enter Code'}
        </h1>
        <p className="text-slate-400 font-bold text-sm">
          {step === 1 
            ? 'Access your secure trading dashboard.' 
            : `We sent a 6-digit code to +91 ${phone.slice(0,5)} ${phone.slice(5)}`
          }
        </p>
      </div>

      {step === 1 ? (
        <form onSubmit={handleSendOTP} className="space-y-8">
          <div>
            <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-[0.2em]">REGISTERED MOBILE</label>
            <div className="flex items-center bg-slate-50 border border-slate-100 rounded-3xl px-6 py-6 focus-within:ring-4 ring-red-50 transition-all">
              <span className="text-slate-900 font-black mr-4 text-lg">+91</span>
              <input 
                type="tel" 
                placeholder="000 000 0000"
                className="bg-transparent flex-1 outline-none text-xl font-bold text-slate-900 placeholder:text-slate-200"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={phone.length !== 10 || isLoading}
            className="w-full bg-[#FF6B6B] text-white h-16 rounded-[24px] font-black text-lg shadow-2xl shadow-red-100 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isLoading ? (
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
                <>Get OTP <ArrowLeft className="rotate-180" size={20} /></>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className="space-y-8">
           <div className="flex justify-between gap-3">
            {otp.map((digit, idx) => (
              <input 
                key={idx}
                id={`otp-${idx}`}
                type="text" 
                inputMode="numeric"
                maxLength={1}
                className="w-full aspect-square bg-slate-50 border border-slate-100 rounded-2xl text-center text-2xl font-black text-slate-900 outline-none focus:ring-4 ring-red-50 transition-all"
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
              />
            ))}
          </div>

          <div className="flex flex-col gap-6">
            <button 
                type="submit" 
                disabled={otp.join('').length !== 6 || isLoading}
                className="w-full bg-[#FF6B6B] text-white h-16 rounded-[24px] font-black text-lg shadow-2xl shadow-red-100 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
                {isLoading ? (
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                    <>Verify & Secure Login <CheckCircle2 size={22} /></>
                )}
            </button>
            
            <div className="flex items-center justify-center gap-2">
                {timer > 0 ? (
                    <span className="text-slate-400 font-bold text-xs flex items-center gap-1">
                        <Timer size={14} /> Resend in {timer}s
                    </span>
                ) : (
                    <button 
                        type="button"
                        onClick={() => setTimer(30)}
                        className="text-[#FF6B6B] font-black text-xs uppercase tracking-widest hover:underline"
                    >
                        Resend OTP
                    </button>
                )}
            </div>
          </div>
        </form>
      )}
      
      <div className="mt-auto py-8 text-center">
          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest leading-loose">
              By proceeding, you agree to Piggypath's <br/>
              Terms of Service & Privacy Policy
          </p>
      </div>
    </div>
  );
}
