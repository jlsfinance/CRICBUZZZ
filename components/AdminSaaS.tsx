
import React from 'react';
import { Settings, Shield, Globe, Users, DollarSign, BarChart } from 'lucide-react';

const AdminSaaS: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black mb-2">League SaaS Controller</h1>
        <p className="text-slate-400">Manage multi-tenant league infrastructures and digital ecosystem branding.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
               <Globe size={20} className="text-blue-500" />
               Active Tenants
            </h2>
            <div className="space-y-4">
               {[
                 { name: "IPL Official", status: "Active", domain: "ipl.pulse.com", rev: "$1.2M", users: "85M" },
                 { name: "Big Bash League", status: "Active", domain: "bbl.pulse.com", rev: "$450K", users: "12M" },
                 { name: "Lanka Premier", status: "Maintenance", domain: "lpl.pulse.com", rev: "$89K", users: "4M" },
               ].map((tenant, i) => (
                 <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                    <div>
                       <h3 className="font-bold text-lg">{tenant.name}</h3>
                       <p className="text-xs text-slate-500">{tenant.domain}</p>
                    </div>
                    <div className="flex gap-8 mt-4 md:mt-0">
                       <div className="text-center">
                          <p className="text-[10px] text-slate-500 font-bold uppercase">REVENUE</p>
                          <p className="text-sm font-black text-green-400">{tenant.rev}</p>
                       </div>
                       <div className="text-center">
                          <p className="text-[10px] text-slate-500 font-bold uppercase">USERS</p>
                          <p className="text-sm font-black text-white">{tenant.users}</p>
                       </div>
                       <div className="flex items-center">
                          <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${tenant.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
                            {tenant.status}
                          </span>
                       </div>
                       <button className="text-slate-400 hover:text-white"><Settings size={18} /></button>
                    </div>
                 </div>
               ))}
            </div>
            <button className="mt-6 w-full py-4 border-2 border-dashed border-slate-800 rounded-2xl text-slate-500 hover:text-slate-300 hover:border-slate-600 font-bold transition-all">
               + REGISTER NEW LEAGUE TENANT
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="glass-panel p-6 rounded-2xl">
                <Shield className="text-red-500 mb-4" />
                <h3 className="font-bold mb-2">Anti-Cheat Analytics</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                   AI-driven anomaly detection identified 14 suspicious betting patterns across 3 matches. Escalated to Integrity Unit.
                </p>
             </div>
             <div className="glass-panel p-6 rounded-2xl">
                <BarChart className="text-indigo-500 mb-4" />
                <h3 className="font-bold mb-2">Global API Usage</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                   Marketplace revenue is up 22% this month. Data feed sales for betting partners reached $140K.
                </p>
             </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-green-900/40">
              <div className="relative z-10">
                 <h3 className="text-xl font-black mb-1">Premium License</h3>
                 <p className="text-green-100/70 text-sm mb-6 font-medium">Enterprise Tier Active</p>
                 <div className="space-y-4 mb-8">
                    {[
                      "White-label Dashboard",
                      "Custom Domain Mapping",
                      "Unlimited API Access",
                      "Umpire Management ERP"
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-bold">
                        <Shield size={14} className="text-green-300" />
                        {feature}
                      </div>
                    ))}
                 </div>
                 <button className="w-full bg-white text-green-800 py-3 rounded-xl font-black text-sm hover:bg-green-50 transition-colors shadow-lg">VIEW BILLING</button>
              </div>
              <DollarSign className="absolute -bottom-10 -right-10 text-white/10 w-48 h-48 rotate-12" />
           </div>

           <div className="glass-panel p-6 rounded-2xl">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                 <Users size={18} className="text-slate-400" />
                 Admin Permissions
              </h3>
              <div className="space-y-3">
                 {[
                   { user: "Sarah J.", role: "League Admin", status: "Active" },
                   { user: "Mike D.", role: "Scout Manager", status: "Away" },
                   { user: "Global AI", role: "Auto Moderator", status: "Active" }
                 ].map((u, i) => (
                   <div key={i} className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-300">{u.user}</span>
                      <span className="text-slate-500">{u.role}</span>
                      <span className={`w-2 h-2 rounded-full ${u.status === 'Active' ? 'bg-green-500' : 'bg-slate-700'}`}></span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSaaS;
