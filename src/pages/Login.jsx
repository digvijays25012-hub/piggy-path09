import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ArrowLeft } from 'lucide-react';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const login = useStore(state => state.login);
  const navigate = useNavigate();

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (phone.length === 10) setStep(2);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otp === '1234') login(phone);
    else alert('Invalid OTP (hint: 1234)');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 pt-12 max-w-md mx-auto">
      <button 
        onClick={() => navigate('/')}
        className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mb-8 text-slate-400 active:opacity-60"
      >
        <ArrowLeft size={20} />
      </button>

      <div className="mb-10">
        <div className="w-14 h-14 bg-[#FF6B6B] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-red-100">
           <img src="https://api.iconify.design/solar:piggy-bank-bold-duotone.svg?color=white" className="w-8 h-8" alt="Piggy Logo" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">Piggypath</h1>
        <p className="text-slate-400 font-bold text-sm">Grow your wealth, simply.</p>
      </div>

      {step === 1 ? (
        <form onSubmit={handlePhoneSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">Phone Number</label>
            <div className="flex items-center bg-slate-50 border border-slate-100 rounded-2xl px-5 py-5 focus-within:ring-2 ring-red-100 transition-all">
              <span className="text-slate-400 font-bold mr-3">+91</span>
              <input 
                type="tel" 
                placeholder="00000 00000"
                className="bg-transparent flex-1 outline-none text-lg font-bold"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-[#FF6B6B] text-white h-16 rounded-2xl font-black text-md shadow-xl shadow-red-200 active:opacity-80">Get Started</button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit} className="space-y-6">
           <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">Enter OTP (1234)</label>
            <input 
              type="text" 
              placeholder="----"
              autoFocus
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-5 text-center text-4xl font-bold tracking-[0.5em] outline-none focus:ring-2 ring-red-100"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
            />
          </div>
          <button type="submit" className="w-full bg-[#FF6B6B] text-white h-16 rounded-2xl font-black text-md shadow-xl shadow-red-200 active:opacity-80">Verify & Login</button>
          <button onClick={() => setStep(1)} className="w-full text-slate-400 font-bold text-xs py-2 uppercase tracking-widest">Change Number</button>
        </form>
      )}
    </div>
  );
}
