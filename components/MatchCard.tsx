
import React from 'react';
import { Match } from '../types';
import { Zap, TrendingUp } from 'lucide-react';

export const MatchCard: React.FC<{ match: Match }> = ({ match }) => {
  return (
    <div className="glass-panel rounded-2xl p-5 hover:border-slate-600 transition-all cursor-pointer group">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
           <span className="px-2 py-0.5 bg-red-500/10 text-red-500 text-[10px] font-black rounded uppercase tracking-tighter flex items-center gap-1">
             <span className="w-1 h-1 bg-red-500 rounded-full animate-ping"></span>
             Live
           </span>
           <span className="text-[10px] text-slate-500 font-bold">{match.format}</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-green-400 font-bold">
           <Zap size={10} />
           {match.winProbability}% Win Prob
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center font-bold text-sm border border-slate-800">{match.teamA}</div>
          <span className="text-xl font-black">VS</span>
          <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center font-bold text-sm border border-slate-800">{match.teamB}</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-black text-white">{match.score}</div>
          <div className="text-[10px] text-slate-500 font-medium">TARGET: 182</div>
        </div>
      </div>

      <div className="border-t border-slate-800 pt-3 mt-3">
         <p className="text-[11px] text-slate-400 font-medium italic">
           <span className="text-slate-600 mr-2">LAST EVENT:</span>
           {match.lastBall || "Match about to start..."}
         </p>
      </div>
    </div>
  );
};
