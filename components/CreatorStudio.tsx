
import React, { useState } from 'react';
import { 
  Camera, Video, FileText, Share2, BarChart2, TrendingUp, UserCheck, 
  Star, Award, Search, Zap, MapPin, ExternalLink, Activity, Info, 
  Loader2, CheckCircle2, Cpu, ShieldCheck, Download, ChevronRight,
  Users
} from 'lucide-react';
import { analyzePlayerSkill } from '../geminiService';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

const CreatorStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Analytics' | 'Scouting'>('Analytics');
  const [analyzingClip, setAnalyzingClip] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStepText, setCurrentStepText] = useState("");
  const [scoutReport, setScoutReport] = useState<any>(null);

  const startAnalysis = async () => {
    setAnalyzingClip(true);
    setAnalysisProgress(0);
    setScoutReport(null);

    const steps = [
      { text: "Capturing Kinematic Frames...", progress: 20 },
      { text: "Mapping Skeletal Vectors...", progress: 45 },
      { text: "Calculating Exit Velocities...", progress: 75 },
      { text: "Finalizing Neural Verdict...", progress: 95 }
    ];

    for (const step of steps) {
      setCurrentStepText(step.text);
      setAnalysisProgress(step.progress);
      await new Promise(r => setTimeout(r, 700));
    }

    try {
      const report = await analyzePlayerSkill({ name: "Arjun Sharma", age: 19 });
      setAnalysisProgress(100);
      setScoutReport(report);
    } catch (e) { console.error(e); } finally { setAnalyzingClip(false); }
  };

  const radarData = scoutReport ? [
    { subject: 'PWR', A: scoutReport.power },
    { subject: 'TEC', A: scoutReport.technique },
    { subject: 'AGL', A: scoutReport.agility },
    { subject: 'TMP', A: scoutReport.temperament },
    { subject: 'CON', A: 85 },
  ] : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-indigo-500/10 text-indigo-400 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-500/20">PRO SCOUT ENGINE v10</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter italic flex items-center gap-4">
             TALENT RADAR
          </h1>
        </div>
        
        <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-900 shadow-2xl w-full lg:w-auto">
           {(['Analytics', 'Scouting'] as const).map(tab => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`flex-1 lg:flex-none px-10 py-3.5 text-[10px] font-black rounded-xl transition-all duration-300 ${activeTab === tab ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-600 hover:text-white'}`}
             >
               {tab.toUpperCase()}
             </button>
           ))}
        </div>
      </div>

      {activeTab === 'Analytics' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[
             { label: 'Broadcast Reach', val: '2.4M', icon: Video, color: 'text-blue-400' },
             // Fix: Users icon is now properly imported from lucide-react
             { label: 'Scout Engagement', val: '842K', icon: Users, color: 'text-green-400' },
             { label: 'Market Value', val: '$4,250', icon: TrendingUp, color: 'text-indigo-400' }
           ].map((stat, i) => (
             <div key={i} className="bg-[#020617] p-8 rounded-[2.5rem] border border-slate-900 flex items-center gap-6 group hover:border-indigo-500/30 transition-all shadow-xl">
                <div className={`p-5 bg-slate-950 rounded-2xl border border-slate-800 ${stat.color} group-hover:scale-110 transition-transform`}>
                   <stat.icon size={28} />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">{stat.label}</p>
                   <h3 className="text-4xl font-black tracking-tighter text-white">{stat.val}</h3>
                </div>
             </div>
           ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
           <div className="xl:col-span-8">
              <div className="bg-[#020617] border border-slate-900 rounded-[3rem] p-6 lg:p-12 relative overflow-hidden min-h-[600px] flex flex-col justify-center">
                 {!scoutReport && !analyzingClip ? (
                    <div className="text-center max-w-xl mx-auto py-10">
                       <div className="w-24 h-24 bg-slate-950 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border border-slate-900 shadow-2xl rotate-3 group cursor-pointer hover:border-indigo-500 transition-colors">
                          <Camera size={40} className="text-slate-700 group-hover:text-indigo-400" />
                       </div>
                       <h3 className="text-3xl font-black mb-4 italic tracking-tight uppercase">Analyze Prospect Clip</h3>
                       <p className="text-slate-500 text-sm font-bold mb-10 leading-relaxed uppercase tracking-widest">GEMINI 3 PRO PERFORMANCE ASSESSMENT FOR ACADEMIES & SCOUTS</p>
                       <button onClick={startAnalysis} className="w-full bg-indigo-600 hover:bg-indigo-500 py-6 rounded-2xl text-white font-black text-sm shadow-2xl shadow-indigo-600/30 transition-all uppercase tracking-widest">
                          INITIALIZE SCAN
                       </button>
                    </div>
                 ) : analyzingClip ? (
                    <div className="w-full max-w-lg mx-auto space-y-12">
                       <div className="flex flex-col items-center gap-8">
                          <div className="relative">
                             <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center animate-pulse">
                                <Loader2 size={48} className="text-indigo-500 animate-spin" />
                             </div>
                             <Cpu className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-400" size={24} />
                          </div>
                          <div className="text-center">
                             <h4 className="text-2xl font-black uppercase tracking-tight italic">{currentStepText}</h4>
                             <div className="mt-6 flex gap-1 justify-center">
                                {[1,2,3,4,5].map(dot => (
                                   <div key={dot} className="w-1.5 h-4 bg-indigo-500/20 rounded-full animate-bounce" style={{animationDelay: `${dot * 0.1}s`}}></div>
                                ))}
                             </div>
                          </div>
                       </div>
                       <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                          <div className="h-full bg-indigo-600 shadow-[0_0_20px_rgba(99,102,241,0.6)] transition-all duration-700" style={{width: `${analysisProgress}%`}}></div>
                       </div>
                    </div>
                 ) : (
                    <div className="animate-in zoom-in-95 duration-700">
                       {/* Pro Header */}
                       <div className="flex flex-col md:flex-row gap-8 items-center mb-12">
                          <div className="w-28 h-28 bg-gradient-to-tr from-indigo-600 to-indigo-800 rounded-[2.5rem] flex items-center justify-center text-4xl font-black shadow-2xl rotate-3 border-4 border-slate-900">AS</div>
                          <div className="text-center md:text-left flex-1">
                             <h2 className="text-5xl font-black italic tracking-tighter mb-2">ARJUN SHARMA</h2>
                             <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                <div className="flex items-center gap-2 text-indigo-400 text-xs font-black uppercase">
                                   <MapPin size={14} /> MUMBAI ACADEMY
                                </div>
                                <div className="h-4 w-px bg-slate-800 hidden md:block"></div>
                                <div className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">PROSPECT ID: #AZ-991</div>
                             </div>
                          </div>
                          <button onClick={() => setScoutReport(null)} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:bg-slate-900 transition-colors">
                             <ChevronRight size={24} className="text-slate-600" />
                          </button>
                       </div>

                       {/* Technical Metrics */}
                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                          <div className="h-72 lg:h-[450px] bg-slate-950/50 rounded-[3rem] p-6 border border-slate-900 relative">
                             <div className="absolute top-8 left-8">
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Biomechanic Plot</p>
                             </div>
                             <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="55%" outerRadius="75%" data={radarData}>
                                   <PolarGrid stroke="#1e293b" />
                                   <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 10, fontWeight: 900 }} />
                                   <Radar name="Scout" dataKey="A" stroke="#6366f1" strokeWidth={3} fill="#6366f1" fillOpacity={0.4} />
                                </RadarChart>
                             </ResponsiveContainer>
                          </div>

                          <div className="space-y-6">
                             <div className="grid grid-cols-2 gap-4">
                                {[
                                   { label: 'POWER', val: scoutReport.power, col: 'text-blue-500' },
                                   { label: 'TECH', val: scoutReport.technique, col: 'text-green-500' },
                                   { label: 'AGILITY', val: scoutReport.agility, col: 'text-purple-500' },
                                   { label: 'TEMPER', val: scoutReport.temperament, col: 'text-orange-500' }
                                ].map((s, i) => (
                                   <div key={i} className="bg-slate-950 p-6 rounded-[2rem] border border-slate-900">
                                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{s.label}</p>
                                      <div className="flex items-end gap-1">
                                         <span className={`text-4xl font-black ${s.col} tracking-tighter tabular-nums`}>{s.val}</span>
                                         <span className="text-[10px] text-slate-700 font-black mb-2">/100</span>
                                      </div>
                                   </div>
                                ))}
                             </div>

                             <div className="p-6 bg-indigo-600/5 rounded-3xl border border-indigo-500/20">
                                <div className="flex items-center gap-3 mb-4">
                                   <Star size={18} className="text-indigo-400" />
                                   <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">AI Master Verdict</span>
                                </div>
                                <p className="text-sm lg:text-base text-slate-300 font-bold italic leading-relaxed">
                                   "{scoutReport.summary}"
                                </p>
                             </div>
                          </div>
                       </div>
                    </div>
                 )}
              </div>
           </div>

           <div className="xl:col-span-4 space-y-6">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Global Discovery Feed</h3>
              <div className="space-y-4">
                 {[
                   { name: "Rahul V.", score: 9.4, pos: "Leg Spin", loc: "Pune" },
                   { name: "Jessica K.", score: 8.8, pos: "Opener", loc: "SYD" }
                 ].map((p, i) => (
                    <div key={i} className="bg-[#020617] p-5 rounded-[2rem] border border-slate-900 flex items-center justify-between hover:bg-slate-900/50 transition-all cursor-pointer group shadow-xl">
                       <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center font-black border border-slate-800 text-slate-600 group-hover:text-white transition-colors">
                             {p.name[0]}
                          </div>
                          <div>
                             <h4 className="text-sm font-black text-white">{p.name}</h4>
                             <p className="text-[10px] text-slate-600 font-black uppercase tracking-tighter">{p.pos} • {p.loc}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <div className="text-xl font-black text-indigo-400 tracking-tighter">{p.score}</div>
                          <div className="text-[8px] font-black text-slate-700 uppercase">Rating</div>
                       </div>
                    </div>
                 ))}
                 <button className="w-full py-5 border-2 border-dashed border-slate-900 rounded-[2rem] text-[10px] font-black text-slate-600 hover:text-indigo-400 hover:border-indigo-500/30 transition-all uppercase tracking-[0.2em]">
                    Expand Radar Scope
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default CreatorStudio;
