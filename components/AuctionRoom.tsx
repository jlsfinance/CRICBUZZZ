
import React, { useState, useEffect } from 'react';
import { PLAYERS, TEAMS } from '../data';
import { Player } from '../types';
import { Gavel, Clock, Trophy, TrendingUp, Zap } from 'lucide-react';
import { getAIAuctionInsights } from '../geminiService';

const AuctionRoom: React.FC = () => {
  const [currentPlayer, setCurrentPlayer] = useState<Player>(PLAYERS[0]);
  const [currentBid, setCurrentBid] = useState(PLAYERS[0].basePrice);
  const [highestBidder, setHighestBidder] = useState<string | null>(null);
  const [timer, setTimer] = useState(30);
  const [isSold, setIsSold] = useState(false);
  const [aiInsight, setAiInsight] = useState("Analyzing market demand...");

  useEffect(() => {
    if (timer > 0 && !isSold) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && !isSold) {
      setIsSold(true);
    }
  }, [timer, isSold]);

  const placeBid = async (teamName: string) => {
    if (isSold) return;
    const newBid = parseFloat((currentBid + 0.1).toFixed(1));
    setCurrentBid(newBid);
    setHighestBidder(teamName);
    setTimer(30);
    
    // Simulate AI Insight on bid
    const insight = await getAIAuctionInsights({ player: currentPlayer.name, bid: newBid, team: teamName });
    setAiInsight(insight);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black">Live Player Auction</h1>
          <p className="text-slate-400">Mega Draft 2025: Season of the Century</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-red-500/10 border border-red-500/50 px-4 py-2 rounded-xl flex items-center gap-3">
             <Clock className="text-red-500 animate-pulse" size={20} />
             <span className="text-2xl font-black text-red-500">{timer}s</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Player Detail */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-panel p-8 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
               <Trophy size={120} className="text-slate-800/50 rotate-12" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-32 h-32 bg-slate-900 rounded-3xl border border-slate-700 flex items-center justify-center">
                  <span className="text-4xl font-black text-slate-700">{currentPlayer.name[0]}</span>
                </div>
                <div>
                  <h2 className="text-4xl font-black mb-2">{currentPlayer.name}</h2>
                  <div className="flex gap-2">
                    <span className="bg-blue-500 text-[10px] font-black px-2 py-0.5 rounded text-white">{currentPlayer.role}</span>
                    {currentPlayer.isOverseas && <span className="bg-orange-500 text-[10px] font-black px-2 py-0.5 rounded text-white">OVERSEAS</span>}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-8 mb-8">
                <div className="text-center p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                  <p className="text-xs text-slate-500 mb-1 font-bold">MATCHES</p>
                  <p className="text-xl font-black">{currentPlayer.stats.matches}</p>
                </div>
                <div className="text-center p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                  <p className="text-xs text-slate-500 mb-1 font-bold">RUNS / WKTS</p>
                  <p className="text-xl font-black">{currentPlayer.stats.runs} / {currentPlayer.stats.wickets}</p>
                </div>
                <div className="text-center p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                  <p className="text-xs text-slate-500 mb-1 font-bold">STRIKE RATE</p>
                  <p className="text-xl font-black text-green-400">{currentPlayer.stats.strikeRate}</p>
                </div>
              </div>

              <div className="flex justify-between items-center bg-slate-950 p-6 rounded-2xl border border-slate-800">
                <div>
                   <p className="text-xs text-slate-500 font-bold mb-1">CURRENT HIGHEST BID</p>
                   <p className="text-4xl font-black text-green-500">${currentBid.toFixed(2)} Cr</p>
                   <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">BIDDER: {highestBidder || 'OPENING'}</p>
                </div>
                {!isSold ? (
                  <div className="flex gap-3">
                    <button onClick={() => placeBid("MI")} className="px-6 py-3 bg-blue-600 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 hover:scale-105 transition-transform">BID MI</button>
                    <button onClick={() => placeBid("CSK")} className="px-6 py-3 bg-yellow-600 rounded-xl font-bold text-sm shadow-lg shadow-yellow-500/20 hover:scale-105 transition-transform">BID CSK</button>
                    <button onClick={() => placeBid("RCB")} className="px-6 py-3 bg-red-600 rounded-xl font-bold text-sm shadow-lg shadow-red-500/20 hover:scale-105 transition-transform">BID RCB</button>
                  </div>
                ) : (
                  <div className="bg-green-500 px-8 py-4 rounded-2xl text-white font-black text-2xl neon-accent rotate-2">SOLD!</div>
                )}
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <Zap size={16} className="text-yellow-400" />
              AI STRATEGY INSIGHT
            </h3>
            <p className="text-slate-300 text-sm italic leading-relaxed">
              {aiInsight}
            </p>
          </div>
        </div>

        {/* Right: Franchise Status */}
        <div className="lg:col-span-4 space-y-6">
           <h3 className="font-bold uppercase tracking-widest text-[10px] text-slate-500">Franchise Purse Status</h3>
           {TEAMS.map(team => (
             <div key={team.id} className="glass-panel p-4 rounded-xl flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center font-bold border border-slate-800">{team.shortName}</div>
                  <div>
                    <h4 className="text-sm font-bold">{team.name}</h4>
                    <p className="text-[10px] text-slate-500 font-bold">{team.squadSize}/25 Players</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-green-400">${team.purseRemaining} Cr</p>
                  <p className="text-[10px] text-slate-500 font-bold">REMAINING</p>
                </div>
             </div>
           ))}

           <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
             <h3 className="font-bold mb-4 flex items-center gap-2">
                <Gavel size={16} />
                Recent Bids
             </h3>
             <div className="space-y-3">
               {[
                 { team: "CSK", amt: "1.9 Cr", time: "2s ago" },
                 { team: "RCB", amt: "1.8 Cr", time: "8s ago" },
                 { team: "MI", amt: "1.5 Cr", time: "15s ago" }
               ].map((bid, i) => (
                 <div key={i} className="flex justify-between items-center text-xs pb-3 border-b border-slate-800 last:border-0">
                    <span className="font-bold text-slate-300">{bid.team}</span>
                    <span className="text-green-500 font-black">{bid.amt}</span>
                    <span className="text-slate-600">{bid.time}</span>
                 </div>
               ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionRoom;
