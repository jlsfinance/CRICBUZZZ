
import React from 'react';
import { MatchCard } from './MatchCard';
import { MATCHES, THREADS } from '../data';
import { DiscussionItem } from './DiscussionItem';
import { TrendingUp, Users, Target, Activity, ArrowRight, Radio } from 'lucide-react';

const StatCard = ({ label, value, trend, icon: Icon, color }: any) => (
  <div className="glass-panel p-6 rounded-2xl hover:border-slate-600 transition-colors cursor-pointer group">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl bg-${color}-500/10 text-${color}-500 group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      <span className="text-green-400 text-xs font-bold bg-green-500/10 px-2 py-1 rounded-full">+{trend}%</span>
    </div>
    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{label}</p>
    <h3 className="text-3xl font-black mt-2 text-white">{value}</h3>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      
      {/* 1. Top Match Slider (Cricbuzz Style) */}
      <section className="relative">
         <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
               <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]"></span>
               Global Match Center
            </h2>
            <div className="text-[10px] font-black text-slate-600 flex items-center gap-1 hover:text-white cursor-pointer transition-colors">
               VIEW SCHEDULE <ArrowRight size={12} />
            </div>
         </div>
         
         {/* Horizontal Scroll Container */}
         <div className="flex overflow-x-auto gap-5 pb-6 -mx-4 px-4 snap-x custom-scrollbar">
            {MATCHES.map((match) => (
               <div key={match.id} className="min-w-[340px] md:min-w-[380px] snap-center">
                  <MatchCard match={match} />
               </div>
            ))}
            {/* View All Card */}
            <div className="min-w-[100px] flex items-center justify-center">
               <button className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all">
                  <ArrowRight size={20} />
               </button>
            </div>
         </div>
      </section>

      {/* 2. Stats & Overview */}
      <section>
        <div className="mb-6">
           <h1 className="text-3xl font-black mb-2 italic">ECOSYSTEM CONTROL</h1>
           <p className="text-slate-400 text-sm font-medium">Real-time metrics across the Global Sports Network.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Live Users" value="1.2M" trend="12.4" icon={Users} color="blue" />
          <StatCard label="Active Bets" value="842K" trend="45.1" icon={Target} color="green" />
          <StatCard label="API Latency" value="12ms" trend="5.2" icon={Activity} color="purple" />
          <StatCard label="Total Revenue" value="$4.2M" trend="8.9" icon={TrendingUp} color="orange" />
        </div>
      </section>

      {/* 3. Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Discussions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              Trending Discussions
            </h2>
            <button className="text-indigo-400 text-xs font-black uppercase hover:underline">Community Hub</button>
          </div>
          <div className="space-y-4">
              {THREADS.map(thread => (
                <DiscussionItem key={thread.id} thread={thread} />
              ))}
          </div>
        </div>

        {/* Right Col: AI & SaaS Status */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/20 rounded-3xl p-6 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-indigo-400 mb-6 font-black text-xs uppercase tracking-widest">
                <Radio size={14} className="animate-pulse" />
                Featured Prediction
              </div>
              <div className="flex justify-between items-center mb-8 px-4">
                <div className="text-center group cursor-pointer">
                   <div className="w-14 h-14 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-2 border border-blue-500/30 group-hover:scale-110 transition-transform">
                      <span className="font-black text-blue-400">MI</span>
                   </div>
                   <div className="text-2xl font-black text-white">62%</div>
                </div>
                <div className="h-px flex-1 bg-slate-700 mx-4 relative">
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#020617] px-2 text-[10px] font-black text-slate-500">VS</div>
                </div>
                <div className="text-center group cursor-pointer">
                   <div className="w-14 h-14 bg-yellow-600/20 rounded-2xl flex items-center justify-center mb-2 border border-yellow-500/30 group-hover:scale-110 transition-transform">
                      <span className="font-black text-yellow-400">CSK</span>
                   </div>
                   <div className="text-2xl font-black text-white">38%</div>
                </div>
              </div>
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                 <p className="text-xs text-slate-400 leading-relaxed italic">
                   "Gemini AI predicts MI's middle order will exploit the spin weakness in overs 11-15. Recommendation: Back MI for the chase."
                 </p>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/10 blur-[60px] -mr-16 -mt-16 rounded-full"></div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border-l-4 border-l-blue-500">
            <h3 className="font-bold mb-4 text-sm uppercase tracking-widest text-slate-400">SaaS Live Feed</h3>
            <ul className="space-y-4">
              {[
                { league: "BBL", event: "Fixture update", time: "2m ago" },
                { league: "PSL", event: "Draft started", time: "15m ago" },
                { league: "SA20", event: "Payment settled", time: "1h ago" }
              ].map((log, i) => (
                <li key={i} className="flex justify-between text-xs items-center">
                  <div className="flex flex-col">
                     <span className="text-blue-400 font-black">{log.league}</span>
                     <span className="text-slate-500">{log.event}</span>
                  </div>
                  <span className="text-slate-600 font-bold bg-slate-900 px-2 py-1 rounded">{log.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
