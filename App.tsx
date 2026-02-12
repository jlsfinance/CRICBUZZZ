
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Trophy, 
  Users, 
  LayoutDashboard, 
  Zap, 
  TrendingUp, 
  Wallet, 
  ShieldCheck, 
  MessageSquare,
  Database,
  BarChart3,
  Flame,
  UserCheck,
  Menu,
  X,
  Bell,
  Swords
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import LiveScoreCenter from './components/LiveScoreCenter';
import AuctionRoom from './components/AuctionRoom';
import CreatorStudio from './components/CreatorStudio';
import AdminSaaS from './components/AdminSaaS';
import AIInsightsPanel from './components/AIInsightsPanel';
import WalletDashboard from './components/WalletDashboard';
import SchemaViewer from './components/SchemaViewer';
import TournamentManager from './components/TournamentManager';

const NavLink = ({ to, icon: Icon, label, active, isMobile = false }: any) => (
  <Link 
    to={to} 
    className={`flex ${isMobile ? 'flex-col items-center gap-1 justify-center' : 'items-center gap-3 px-4 py-3 rounded-xl'} transition-all duration-300 group 
    ${active 
      ? 'text-green-400' 
      : 'text-slate-400 hover:text-white'}`}
  >
    <Icon size={isMobile ? 22 : 20} className={active ? 'text-green-400' : 'group-hover:text-green-400'} />
    <span className={`font-black ${isMobile ? 'text-[9px]' : 'text-sm'} uppercase tracking-widest`}>{label}</span>
    {active && !isMobile && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>}
  </Link>
);

const MainLayout = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-100 selection:bg-green-500/30">
      {/* Desktop Sidebar */}
      <aside className={`fixed lg:sticky top-0 z-50 w-72 h-screen border-r border-slate-900 bg-[#020617] hidden lg:block`}>
        <div className="p-8 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-green-500/20 rotate-3">CP</div>
            <span className="text-2xl font-black tracking-tighter italic">CRICPULSE</span>
          </div>
          
          <div className="space-y-1 mb-10">
            <p className="px-4 text-[10px] uppercase tracking-[0.2em] text-slate-600 font-black mb-4">Broadcast Hub</p>
            <NavLink to="/" icon={LayoutDashboard} label="Home" active={location.pathname === '/'} />
            <NavLink to="/live" icon={Zap} label="Live Feed" active={location.pathname === '/live'} />
            <NavLink to="/auction" icon={Flame} label="Auction" active={location.pathname === '/auction'} />
            {/* Fantasy removed as per request */}
          </div>

          <div className="space-y-1 mb-10">
            <p className="px-4 text-[10px] uppercase tracking-[0.2em] text-slate-600 font-black mb-4">AI Pro Systems</p>
            <NavLink to="/tournament" icon={Swords} label="Tournaments" active={location.pathname === '/tournament'} />
            <NavLink to="/ai" icon={Trophy} label="AI Coach" active={location.pathname === '/ai'} />
            <NavLink to="/creators" icon={UserCheck} label="Scouting" active={location.pathname === '/creators'} />
          </div>

          <div className="mt-auto pt-6 border-t border-slate-900">
             <NavLink to="/wallet" icon={Wallet} label="Wallet" active={location.pathname === '/wallet'} />
             <NavLink to="/saas" icon={ShieldCheck} label="SaaS" active={location.pathname === '/saas'} />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
        <header className="sticky top-0 z-40 h-20 border-b border-slate-900 bg-[#020617]/90 backdrop-blur-xl flex items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-4">
            <div className="lg:hidden flex items-center gap-2">
               <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-black text-sm rotate-3">CP</div>
               <span className="text-lg font-black tracking-tighter italic">CRICPULSE</span>
            </div>
            <div className="hidden md:flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-900">
               <div className="flex gap-1">
                  <div className="w-1 h-3 bg-green-500 rounded-full animate-bounce"></div>
                  <div className="w-1 h-3 bg-green-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
               </div>
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Engine Live</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 lg:gap-8">
            <button className="p-2.5 text-slate-400 hover:text-white transition-colors relative">
               <Bell size={20} />
               <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#020617]"></span>
            </button>
            <div className="flex items-center gap-3 bg-slate-950 rounded-2xl px-4 py-2 border border-slate-900">
              <Wallet size={16} className="text-green-500" />
              <span className="text-sm font-black text-white">45.2K</span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-700 flex items-center justify-center text-xs font-black shadow-lg">JD</div>
          </div>
        </header>
        
        <main className="flex-1 p-4 lg:p-10 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-[#020617] border-t border-slate-900 flex items-center justify-around px-2 lg:hidden z-50 backdrop-blur-xl">
        <NavLink to="/" icon={LayoutDashboard} label="Home" active={location.pathname === '/'} isMobile />
        <NavLink to="/live" icon={Zap} label="Live" active={location.pathname === '/live'} isMobile />
        <NavLink to="/tournament" icon={Swords} label="Events" active={location.pathname === '/tournament'} isMobile />
        <NavLink to="/auction" icon={Flame} label="Auction" active={location.pathname === '/auction'} isMobile />
        <NavLink to="/creators" icon={UserCheck} label="Scout" active={location.pathname === '/creators'} isMobile />
      </nav>
    </div>
  );
};

const App = () => {
  return (
    <HashRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/live" element={<LiveScoreCenter />} />
          <Route path="/auction" element={<AuctionRoom />} />
          {/* Fantasy Route Removed */}
          <Route path="/creators" element={<CreatorStudio />} />
          <Route path="/ai" element={<AIInsightsPanel />} />
          <Route path="/wallet" element={<WalletDashboard />} />
          <Route path="/saas" element={<AdminSaaS />} />
          <Route path="/schema" element={<SchemaViewer />} />
          <Route path="/tournament" element={<TournamentManager />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </MainLayout>
    </HashRouter>
  );
};

export default App;
