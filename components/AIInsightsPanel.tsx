
import React, { useState } from 'react';
import { Target, Zap, TrendingUp, Info, Activity, BrainCircuit } from 'lucide-react';
import { getAICommentary } from '../geminiService';

const AIInsightsPanel: React.FC = () => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getCoachAnalysis = async () => {
    setLoading(true);
    // Mocking match data for comprehensive analysis
    const data = { match: "MI vs CSK", pitch: "Dry with light cracks", weather: "Humid, dew expected", toss: "CSK won and bowl" };
    const res = await getAICommentary(data);
    setInsight(res || "Analysis failed. Please try again.");
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
            <BrainCircuit size={36} className="text-green-500" />
            AI Coach & Prediction Studio
          </h1>
          <p className="text-slate-400">Advanced ML models predicting outcomes and providing technical analysis.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-panel p-8 rounded-3xl relative overflow-hidden bg-slate-900/50">
             <div className="flex items-center gap-3 mb-8">
               <div className="p-3 bg-green-500/10 rounded-2xl">
                  <Target size={32} className="text-green-500" />
               </div>
               <div>
                  <h3 className="text-xl font-black">Strategic Deep-Dive</h3>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Powered by Gemini 3 Flash</p>
               </div>
             </div>

             <div className="bg-slate-950/80 p-8 rounded-2xl border border-slate-800 min-h-[300px] flex flex-col justify-center items-center text-center">
                {loading ? (
                  <div className="space-y-4">
                    <Zap className="mx-auto text-green-500 animate-bounce" size={48} />
                    <p className="text-slate-400 font-bold animate-pulse">Running Monte Carlo Simulations...</p>
                  </div>
                ) : insight ? (
                  <div className="text-left w-full">
                     <div className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-[10px] font-black w-fit mb-4">TACTICAL REPORT</div>
                     <p className="text-slate-300 leading-relaxed italic">{insight}</p>
                  </div>
                ) : (
                  <div className="max-w-md">
                    <p className="text-slate-500 mb-6">Ask the AI Coach for a tactical analysis of today's pitch, player weaknesses, or simulated match results.</p>
                    <button 
                      onClick={getCoachAnalysis}
                      className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-2xl font-black shadow-xl shadow-green-500/20 transition-all active:scale-95"
                    >
                      GENERATE ANALYSIS
                    </button>
                  </div>
                )}
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="glass-panel p-6 rounded-2xl">
                <TrendingUp className="text-blue-500 mb-4" />
                <h3 className="font-bold mb-2">Win Prob Breakdown</h3>
                <div className="space-y-4 mt-4">
                   <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">Batting First Advantage</div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full w-[42%]"></div>
                      </div>
                   </div>
                   <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">Dew Factor Impact</div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-orange-500 h-full w-[78%]"></div>
                      </div>
                   </div>
                </div>
             </div>
             <div className="glass-panel p-6 rounded-2xl">
                <Activity className="text-red-500 mb-4" />
                <h3 className="font-bold mb-2">Live Anomaly Tracking</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                   Real-time monitoring of match dynamics to detect unexpected performance shifts or market volatility.
                </p>
                <div className="px-3 py-1 bg-green-500/10 text-green-500 rounded text-[10px] font-bold w-fit">STATUS: CLEAR</div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <h3 className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Real-time Variables</h3>
           <div className="glass-panel p-6 rounded-2xl space-y-6">
              {[
                { label: "Wankhede Pitch", value: "Flat & Dry", detail: "High Bounce Expected" },
                { label: "Dew Probability", value: "85%", detail: "Critical for Chase" },
                { label: "Humidity", value: "72%", detail: "Swing Potential Low" },
                { label: "Avg 1st Inn Score", value: "174", detail: "Last 10 T20s" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <span className="text-slate-500 text-[10px] font-bold uppercase">{item.label}</span>
                  <span className="text-white font-black text-lg">{item.value}</span>
                  <span className="text-slate-500 text-[10px] italic">{item.detail}</span>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsightsPanel;
