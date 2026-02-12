
import React from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft, Plus, History, ShieldCheck } from 'lucide-react';

const WalletDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black mb-2">Digital Economy</h1>
          <p className="text-slate-400">Manage your coins, withdrawals, and marketplace transactions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-gradient-to-br from-slate-800 to-slate-950 p-8 rounded-[40px] border border-slate-700 relative overflow-hidden shadow-2xl">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-12">
                   <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white"><ShieldCheck size={28} /></div>
                   <div className="text-[10px] font-black bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/30 tracking-tighter uppercase">Verified Wallet</div>
                </div>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">Current Balance</p>
                <div className="flex items-end gap-3 mb-8">
                   <h2 className="text-5xl font-black text-white">45,200</h2>
                   <span className="text-slate-500 font-bold mb-2">COINS</span>
                </div>
                <div className="flex gap-4">
                   <button className="flex-1 bg-white text-slate-900 py-3 rounded-2xl font-black text-sm hover:bg-slate-100 flex items-center justify-center gap-2">
                     <Plus size={16} /> ADD COINS
                   </button>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 blur-[100px] -mr-32 -mt-32 rounded-full"></div>
           </div>

           <div className="glass-panel p-6 rounded-3xl">
              <h3 className="font-bold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                 <button className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col items-center gap-2 hover:border-slate-700 transition-all">
                    <ArrowUpRight className="text-green-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Withdraw</span>
                 </button>
                 <button className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col items-center gap-2 hover:border-slate-700 transition-all">
                    <History className="text-blue-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">History</span>
                 </button>
              </div>
           </div>
        </div>

        <div className="lg:col-span-2">
           <div className="glass-panel rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                 <h3 className="font-bold uppercase tracking-widest text-xs text-slate-400 flex items-center gap-2">
                    <History size={16} />
                    Transaction Log
                 </h3>
                 <button className="text-xs font-bold text-blue-400 hover:underline">Download Statement</button>
              </div>
              <div className="divide-y divide-slate-800">
                 {[
                   { type: "IN", desc: "Fantasy Reward - Grand League #42", amt: "+12,500", date: "24 Oct 2024", icon: ArrowDownLeft, color: "green" },
                   { type: "OUT", desc: "Auction Bid - MI Purchase", amt: "-2.4 Cr (Converted)", date: "23 Oct 2024", icon: ArrowUpRight, color: "red" },
                   { type: "IN", desc: "Referral Bonus - User_842", amt: "+500", date: "22 Oct 2024", icon: ArrowDownLeft, color: "green" },
                   { type: "OUT", desc: "Entry Fee - Daily Mega Contest", amt: "-2,000", date: "22 Oct 2024", icon: ArrowUpRight, color: "red" },
                   { type: "IN", desc: "Creator Tip from @FanX", amt: "+1,200", date: "21 Oct 2024", icon: ArrowDownLeft, color: "green" }
                 ].map((t, i) => (
                   <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-800/20 transition-colors">
                      <div className="flex items-center gap-4">
                         <div className={`p-3 bg-${t.color}-500/10 text-${t.color}-500 rounded-xl`}>
                            <t.icon size={18} />
                         </div>
                         <div>
                            <p className="font-bold text-sm text-slate-100">{t.desc}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{t.date}</p>
                         </div>
                      </div>
                      <div className={`text-lg font-black ${t.color === 'green' ? 'text-green-500' : 'text-red-500'}`}>
                         {t.amt}
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default WalletDashboard;
