
import React, { useState } from 'react';
import { PLAYERS } from '../data';
import { Player } from '../types';
import { Users, Shield, Zap, TrendingUp, Info } from 'lucide-react';
import { getAIFantasyAdvice } from '../geminiService';

const FantasyHub: React.FC = () => {
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const togglePlayer = (id: string) => {
    setSelectedPlayers(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const fetchAdvice = async () => {
    setLoadingAI(true);
    const advice = await getAIFantasyAdvice(PLAYERS);
    setAiAdvice(advice);
    setLoadingAI(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black">Fantasy Squad Arena</h1>
          <p className="text-slate-400">Pick your XI, dominate the leaderboard, win rewards.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 flex items-center gap-2">
             <span className="text-slate-500 text-xs font-bold">Selected:</span>
             <span className="text-green-500 font-black">{selectedPlayers.length}/11</span>
          </div>
          <button onClick={fetchAdvice} className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2 rounded-xl font-bold text-sm shadow-xl shadow-blue-500/20 flex items-center gap-2">
            <Zap size={16} fill="white" />
            AI SUGGESTION
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="glass-panel rounded-3xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-900/50 text-slate-500 border-b border-slate-800">
                  <th className="px-6 py-4 font-black uppercase">Player</th>
                  <th className="px-6 py-4 font-black uppercase">Role</th>
                  <th className="px-6 py-4 font-black uppercase">Credits</th>
                  <th className="px-6 py-4 font-black uppercase">Recent Pts</th>
                  <th className="px-6 py-4 font-black uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {PLAYERS.map(player => (
                  <tr key={player.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-bold">{player.name[0]}</div>
                         <div>
                           <div className="font-bold text-sm">{player.name}</div>
                           <div className="text-[10px] text-slate-500 font-bold">Team {player.isOverseas ? '(OS)' : '(IND)'}</div>
                         </div>
                       </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-300">{player.role}</td>
                    <td className="px-6 py-4 font-black text-white">9.5</td>
                    <td className="px-6 py-4 text-green-400 font-bold">42 pts</td>
                    <td className="px-6 py-4">
                       <button 
                         onClick={() => togglePlayer(player.id)}
                         className={`px-4 py-1.5 rounded-lg font-bold transition-all ${selectedPlayers.includes(player.id) ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-green-600 text-white hover:bg-green-500'}`}
                       >
                         {selectedPlayers.includes(player.id) ? 'REMOVE' : 'ADD'}
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-slate-700 rounded-3xl p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Users size={120} />
             </div>
             <div className="relative z-10">
                <h3 className="font-bold flex items-center gap-2 mb-4 text-blue-400">
                  <Zap size={16} />
                  AI COACH ANALYTICS
                </h3>
                {loadingAI ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-800 rounded w-full"></div>
                    <div className="h-4 bg-slate-800 rounded w-5/6"></div>
                  </div>
                ) : aiAdvice ? (
                  <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                    {aiAdvice}
                  </div>
                ) : (
                  <div className="text-center py-8">
                     <Info size={40} className="mx-auto text-slate-700 mb-4" />
                     <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Tap the button above for AI-suggested winning combinations.</p>
                  </div>
                )}
             </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl">
             <h3 className="font-bold mb-4">Upcoming Contest</h3>
             <div className="space-y-4">
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-slate-400">Grand League</span>
                      <span className="text-green-400 font-black text-sm">$1.2M Pool</span>
                   </div>
                   <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3">
                      <div className="bg-green-500 h-full w-[65%]"></div>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-500 font-bold">642k / 1M spots filled</span>
                      <button className="bg-slate-800 px-3 py-1.5 rounded-lg text-[10px] font-black hover:bg-slate-700">JOIN $10</button>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FantasyHub;
