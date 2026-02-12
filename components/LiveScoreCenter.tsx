
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { getAICommentary } from '../geminiService';
import { MATCHES } from '../data';
import { Zap, Globe, BarChart2, Radio, History, Languages, Activity, Cpu, TrendingUp, Info, Check, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from 'recharts';

const LiveScoreCenter: React.FC = () => {
  const [commentary, setCommentary] = useState("Satellite link established. Ready for broadcast...");
  const [loadingAI, setLoadingAI] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [language, setLanguage] = useState("English");
  const [activeGraph, setActiveGraph] = useState<'Manhattan' | 'WinProb'>('Manhattan');
  const [balls, setBalls] = useState(['1', 'W', '0', '4', '6', '1wd']);
  const [socketStatus, setSocketStatus] = useState<'Connecting' | 'Connected'>('Connecting');
  
  const match = MATCHES[0];
  const ballEndRef = useRef<HTMLDivElement>(null);

  // Simulated WebSocket Effect
  useEffect(() => {
    // 1. Simulate Connection
    const connectTimer = setTimeout(() => setSocketStatus('Connected'), 1500);

    // 2. Simulate Ball Stream
    const streamInterval = setInterval(() => {
      const outcomes = ['0', '1', '2', '4', '6', 'W', '1lb', '0'];
      const newBall = outcomes[Math.floor(Math.random() * outcomes.length)];
      setBalls(prev => [...prev.slice(-12), newBall]); // Keep last 12
    }, 4000); // New ball every 4 seconds

    return () => {
      clearTimeout(connectTimer);
      clearInterval(streamInterval);
    };
  }, []);

  // Auto-scroll balls
  useEffect(() => {
    ballEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [balls]);

  // Fake progress bar for AI generation
  useEffect(() => {
    let interval: any;
    if (loadingAI) {
      setGenerationProgress(0);
      interval = setInterval(() => {
        setGenerationProgress(prev => Math.min(prev + Math.random() * 20, 90));
      }, 200);
    } else {
      setGenerationProgress(100);
    }
    return () => clearInterval(interval);
  }, [loadingAI]);

  const chartData = useMemo(() => [
    { over: 12, runs: 4, cumulative: 84, prob: 50 },
    { over: 13, runs: 12, cumulative: 96, prob: 52 },
    { over: 14, runs: 6, cumulative: 102, prob: 48 },
    { over: 15, runs: 15, cumulative: 117, prob: 58 },
    { over: 16, runs: 11, cumulative: 128, prob: 55 },
    { over: 17, runs: 17, cumulative: 145, prob: 62 },
  ], []);

  const fetchAICommentary = async (selectedLang: string) => {
    if (loadingAI) return;
    setLoadingAI(true);
    // await new Promise(r => setTimeout(r, 800)); // UI polish - removed to make it feel faster, relying on progress bar
    const text = await getAICommentary(match, selectedLang);
    setCommentary(text || "Direct feed interruption. Syncing...");
    setLoadingAI(false);
  };

  useEffect(() => {
    fetchAICommentary(language);
  }, [language]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#020617] border border-slate-700 p-4 rounded-xl shadow-2xl">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Over {label}</p>
          {payload.map((entry: any, index: number) => (
             <div key={index} className="flex items-center gap-2 text-sm font-bold">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                <span className="text-white">{entry.name === 'prob' ? 'Win Probability' : 'Runs Scored'}:</span>
                <span className="text-indigo-400 font-black">{entry.value}{entry.name === 'prob' ? '%' : ''}</span>
             </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      {/* Main Score & Graph Section */}
      <div className="xl:col-span-8 space-y-6">
        {/* Dynamic Scoreboard Card */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-6 lg:p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-500/5 to-transparent"></div>
          
          <div className="flex justify-between items-start mb-10 relative z-10">
             <div className="flex items-center gap-3">
                <div className={`px-3 py-1 rounded-lg text-[10px] font-black text-white flex items-center gap-2 shadow-lg transition-colors ${socketStatus === 'Connected' ? 'bg-red-600 shadow-red-600/20' : 'bg-orange-500 shadow-orange-500/20'}`}>
                   <span className={`w-1.5 h-1.5 bg-white rounded-full ${socketStatus === 'Connected' ? 'animate-pulse' : 'animate-ping'}`}></span>
                   {socketStatus === 'Connected' ? 'LIVE PRO' : 'CONNECTING...'}
                </div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                   <Radio size={12} className="text-blue-500" />
                   ULTRA-HD BROADCAST
                </div>
             </div>
             <div className="hidden lg:flex items-center gap-6">
                <div className="text-right">
                   <p className="text-[9px] font-black text-slate-500 uppercase">Current RR</p>
                   <p className="text-sm font-black text-white">8.36</p>
                </div>
                <div className="text-right">
                   <p className="text-[9px] font-black text-slate-500 uppercase">Req. RR</p>
                   <p className="text-sm font-black text-white">13.8</p>
                </div>
             </div>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-12 relative z-10">
             <div className="flex flex-col items-center lg:items-start text-center lg:text-left group">
                <div className="w-20 h-20 bg-blue-900/20 rounded-[2rem] flex items-center justify-center mb-4 border border-blue-500/30 group-hover:scale-110 transition-transform">
                   <span className="text-2xl font-black text-blue-400">MI</span>
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Mumbai Indians</h3>
             </div>

             <div className="flex-1 flex flex-col items-center">
                <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-4">TARGET 184</div>
                <div className="text-7xl lg:text-8xl font-black text-white tracking-tighter tabular-nums drop-shadow-2xl">
                   145<span className="text-slate-700 mx-2">/</span>4
                </div>
                <div className="mt-4 text-xs font-black text-green-500 uppercase tracking-widest bg-green-500/10 px-4 py-1.5 rounded-full border border-green-500/20">
                   Mumbai Indians need 39 from 16 balls
                </div>
             </div>

             <div className="flex flex-col items-center lg:items-end text-center lg:text-right group">
                <div className="w-20 h-20 bg-yellow-900/20 rounded-[2rem] flex items-center justify-center mb-4 border border-yellow-500/30 group-hover:scale-110 transition-transform">
                   <span className="text-2xl font-black text-yellow-400">CSK</span>
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Chennai Kings</h3>
             </div>
          </div>

          {/* Ball by Ball Mobile Strip */}
          <div className="flex overflow-x-auto gap-2 pb-2 custom-scrollbar justify-center items-center h-16">
             {balls.map((b, i) => (
                <div key={i} className={`min-w-[48px] h-12 rounded-xl flex items-center justify-center text-sm font-black border transition-all animate-in zoom-in slide-in-from-right duration-300 ${
                   b === 'W' ? 'bg-red-600 border-red-500 text-white animate-pulse' : 
                   b === '4' || b === '6' ? 'bg-green-600 border-green-500 text-white shadow-xl shadow-green-600/20' : 
                   'bg-slate-950 border-slate-800 text-slate-400'
                }`}>
                   {b}
                </div>
             ))}
             <div ref={ballEndRef}></div>
             <div className="min-w-[48px] h-12 rounded-xl border-2 border-slate-800 border-dashed flex items-center justify-center text-[10px] font-black text-slate-600 animate-pulse">
                ...
             </div>
          </div>
        </div>

        {/* Pro Analytics Hub */}
        <div className="bg-slate-950 border border-slate-900 rounded-[2.5rem] p-8">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                 <BarChart2 size={16} className="text-indigo-400" />
                 PRO ANALYTICS
              </h3>
              <div className="flex bg-[#020617] p-1 rounded-xl border border-slate-800">
                 {(['Manhattan', 'WinProb'] as const).map(tab => (
                   <button 
                     key={tab} 
                     onClick={() => setActiveGraph(tab)}
                     className={`px-4 py-1.5 text-[9px] font-black rounded-lg transition-all ${activeGraph === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600 hover:text-white'}`}
                   >
                     {tab.toUpperCase()}
                   </button>
                 ))}
              </div>
           </div>
           
           <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                 {activeGraph === 'Manhattan' ? (
                   <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="over" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                      <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{fill: '#1e293b', opacity: 0.4}} content={<CustomTooltip />} />
                      <Bar dataKey="runs" fill="#6366f1" radius={[4, 4, 0, 0]} />
                   </BarChart>
                 ) : (
                    <AreaChart data={chartData}>
                       <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                       <XAxis dataKey="over" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                       <YAxis domain={[0, 100]} stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                       <Tooltip cursor={{stroke: '#22c55e', strokeWidth: 1}} content={<CustomTooltip />} />
                       <Area type="monotone" dataKey="prob" stroke="#22c55e" strokeWidth={3} fill="url(#colorProb)" />
                       <defs>
                          <linearGradient id="colorProb" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
                             <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                    </AreaChart>
                 )}
              </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Multilingual Commentary Sidebar */}
      <div className="xl:col-span-4 space-y-6">
        <div className="bg-[#020617] border border-slate-900 rounded-[2.5rem] p-6 lg:p-8 h-[760px] flex flex-col shadow-2xl relative overflow-hidden group">
           {/* Studio Branding */}
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                 <div className="p-3 bg-indigo-600/10 rounded-2xl text-indigo-400 border border-indigo-500/20 shadow-xl shadow-indigo-600/5">
                    <Languages size={18} />
                 </div>
                 <div>
                    <h3 className="font-black text-xs text-white uppercase tracking-widest leading-none">AI PRO STUDIO</h3>
                    <p className="text-[8px] text-slate-600 font-black uppercase tracking-tighter mt-1">REAL-TIME LOCALIZATION</p>
                 </div>
              </div>
              
              {/* Language Dropdown */}
              <div className="relative group/lang">
                 <select 
                   value={language} 
                   onChange={(e) => setLanguage(e.target.value)}
                   className="appearance-none bg-slate-950 text-[10px] font-black text-indigo-400 outline-none cursor-pointer pl-4 pr-8 py-2 rounded-xl border border-slate-900 shadow-inner focus:border-indigo-500/50"
                 >
                   <option value="English">ENGLISH</option>
                   <option value="Hindi">HINDI (हिन्दी)</option>
                   <option value="Gujarati">GUJARATI (ગુજરાતી)</option>
                   <option value="Tamil">TAMIL (தமிழ்)</option>
                   <option value="Urdu">URDU (اردو)</option>
                 </select>
                 <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Globe size={12} className="text-slate-500" />
                 </div>
              </div>
           </div>

           {/* Content Stream */}
           <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6 pb-6 relative">
              {/* Progress Indicator Line */}
              {loadingAI && (
                 <div className="absolute top-0 left-0 w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 transition-all duration-200" style={{ width: `${generationProgress}%` }}></div>
                 </div>
              )}

              {/* Main AI Verdict */}
              <div className={`bg-slate-900/40 p-6 rounded-3xl border transition-all duration-500 ${loadingAI ? 'border-indigo-500/30 bg-indigo-900/10' : 'border-slate-800 hover:border-indigo-500/20'}`}>
                 <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                       <span className={`w-1.5 h-1.5 rounded-full ${loadingAI ? 'bg-indigo-400 animate-ping' : 'bg-green-500'}`}></span>
                       <span className={`text-[9px] font-black uppercase ${loadingAI ? 'text-indigo-300' : 'text-slate-500'}`}>
                          {loadingAI ? `GENERATING IN ${language.toUpperCase()}...` : `${language.toUpperCase()} FEED ACTIVE`}
                       </span>
                    </div>
                    <Cpu size={14} className={loadingAI ? 'text-indigo-400 animate-pulse' : 'text-slate-700'} />
                 </div>
                 
                 <div className="text-sm lg:text-base leading-relaxed text-slate-200 font-bold italic relative min-h-[80px] flex items-center">
                    {loadingAI ? (
                       <div className="w-full space-y-3">
                          <div className="h-3 bg-indigo-500/20 rounded w-full animate-pulse"></div>
                          <div className="h-3 bg-indigo-500/20 rounded w-5/6 animate-pulse delay-75"></div>
                          <div className="h-3 bg-indigo-500/20 rounded w-4/6 animate-pulse delay-150"></div>
                       </div>
                    ) : (
                       <p className="animate-in fade-in duration-500">"{commentary}"</p>
                    )}
                 </div>

                 <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-800/50">
                    <button 
                      onClick={() => fetchAICommentary(language)} 
                      disabled={loadingAI}
                      className={`text-[9px] font-black flex items-center gap-2 uppercase tracking-widest transition-all ${loadingAI ? 'text-slate-600 cursor-not-allowed' : 'text-indigo-400 hover:text-white'}`}
                    >
                       <RefreshCw size={12} className={loadingAI ? 'animate-spin' : ''} /> 
                       {loadingAI ? 'SYNCING...' : 'SYNC FEED'}
                    </button>
                    {!loadingAI && (
                      <div className="flex gap-1.5">
                         <div className="w-1 h-3 bg-indigo-500/30 rounded-full animate-bounce"></div>
                         <div className="w-1 h-3 bg-indigo-500/30 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                         <div className="w-1 h-3 bg-indigo-500/30 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                      </div>
                    )}
                 </div>
              </div>

              {/* Live Timeline Style Logs */}
              <div className="space-y-4 pt-4">
                 <h4 className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] px-2">Live Timeline</h4>
                 {[
                   { over: '17.2', event: '4 RUNS', text: 'Surya plays a gorgeous scoop!', icon: Zap, color: 'text-green-500' },
                   { over: '17.1', event: 'DOT', text: 'Tense atmosphere building up.', icon: Info, color: 'text-slate-500' },
                 ].map((log, i) => (
                    <div key={i} className="flex gap-4 p-4 hover:bg-slate-900/40 rounded-2xl transition-all group/item">
                       <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-[10px] font-black text-slate-500 border border-slate-900 group-hover/item:border-indigo-500/50">
                             {log.over}
                          </div>
                          <div className="w-px h-full bg-slate-900 mt-2"></div>
                       </div>
                       <div>
                          <div className="flex items-center gap-2 mb-1">
                             <log.icon size={12} className={log.color} />
                             <span className={`text-[10px] font-black uppercase ${log.color}`}>{log.event}</span>
                          </div>
                          <p className="text-xs text-slate-400 font-bold">{log.text}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* Mobile Quick Insight Bar */}
           <div className="mt-auto pt-6 border-t border-slate-900">
              <div className="relative group">
                 <input 
                   type="text" 
                   placeholder="Ask Pro-AI for stats..." 
                   className="w-full bg-slate-950 border border-slate-900 rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-700" 
                 />
                 <button className="absolute right-2 top-2 p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg transition-all active:scale-95">
                    <TrendingUp size={16} />
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LiveScoreCenter;
