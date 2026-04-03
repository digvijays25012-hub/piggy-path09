import React from 'react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, Wallet, Bell, Shield, HelpCircle, ChevronRight, Settings } from 'lucide-react';

export default function Profile() {
  const { user, balance, logout } = useStore();

  return (
    <div className="pb-24 px-6 pt-16 bg-slate-50 min-h-screen">
      <header className="flex flex-col items-center mb-10">
        <div className="w-24 h-24 bg-white rounded-[40px] flex items-center justify-center shadow-xl shadow-slate-200 border-2 border-white relative mb-4">
           <User size={48} className="text-[#FF6B6B]" />
           <div className="absolute bottom-2 right-2 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white shadow-sm" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">+91 {user?.phone}</h2>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Tier 1 Investor</p>
      </header>

      {/* Account Card */}
      <section className="mb-10 card p-6 bg-white flex items-center justify-between border-2 border-red-50 shadow-red-100/50">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-[#FF6B6B]">
               <Wallet size={24} />
            </div>
            <div>
               <p className="text-xs text-slate-400 font-black uppercase">AVAILABLE BALANCE</p>
               <h3 className="text-2xl font-black text-slate-900">₹{balance.toLocaleString()}</h3>
            </div>
         </div>
         <button className="btn-primary py-2 px-4 text-xs font-black rounded-xl">Add Funds</button>
      </section>

      {/* Profile Sections */}
      <section className="space-y-4 mb-10">
         {[
            { icon: <Bell size={20} />, title: 'Notifications', subtitle: 'Manage price alerts' },
            { icon: <Shield size={20} />, title: 'Security', subtitle: 'Biometrics & pin' },
            { icon: <Settings size={20} />, title: 'Account Settings', subtitle: 'Bank & nominee details' },
            { icon: <HelpCircle size={20} />, title: 'Help & Support', subtitle: '24/7 dedicated assistance' },
         ].map((item, idx) => (
            <motion.div 
               key={item.title}
               whileTap={{ scale: 0.98 }}
               className="card flex items-center justify-between p-4 bg-white cursor-pointer hover:bg-slate-50 transition-colors"
            >
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                     {item.icon}
                  </div>
                  <div>
                     <h4 className="font-extrabold text-slate-900 text-sm">{item.title}</h4>
                     <p className="text-[10px] text-slate-400 font-bold uppercase">{item.subtitle}</p>
                  </div>
               </div>
               <ChevronRight size={18} className="text-slate-300" />
            </motion.div>
         ))}
      </section>

      {/* Logout */}
      <button 
        onClick={logout}
        className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-slate-100 text-red-500 font-black text-sm uppercase tracking-widest active:bg-red-50 transition-colors"
      >
        <LogOut size={20} />
        Log Out Session
      </button>

      <footer className="mt-10 mb-2 text-center">
         <p className="text-[10px] text-slate-300 font-black tracking-widest uppercase">PIGGYPATH v2.4.0 · STABLE</p>
      </footer>
    </div>
  );
}
