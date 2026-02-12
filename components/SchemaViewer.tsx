
import React from 'react';
import { Database, Server, Cpu, Globe } from 'lucide-react';

const SchemaViewer: React.FC = () => {
  const sqlSchema = `
-- CORE CRICKET SYSTEM SCHEMA (PRODUCTION READY)

CREATE TABLE leagues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  tenant_id UUID REFERENCES tenants(id),
  config JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE teams (
  id UUID PRIMARY KEY,
  league_id UUID REFERENCES leagues(id),
  name VARCHAR(100),
  short_name VARCHAR(10),
  purse_balance DECIMAL(20, 2),
  logo_url TEXT
);

CREATE TABLE players (
  id UUID PRIMARY KEY,
  full_name VARCHAR(255),
  role player_role_enum,
  nationality VARCHAR(50),
  base_price DECIMAL(20,2),
  current_team_id UUID REFERENCES teams(id)
);

CREATE TABLE matches (
  id UUID PRIMARY KEY,
  league_id UUID REFERENCES leagues(id),
  team_a UUID REFERENCES teams(id),
  team_b UUID REFERENCES teams(id),
  format match_format_enum,
  status match_status_enum,
  live_data JSONB, -- Stores ball-by-ball for partitioning
  win_prob_meta JSONB
);

CREATE TABLE wallets (
  user_id UUID PRIMARY KEY,
  balance DECIMAL(20,2) DEFAULT 0.00,
  currency VARCHAR(10) DEFAULT 'COIN'
);

-- PARTITIONED TABLE FOR HIGH VOLUME MATCH DATA
CREATE TABLE ball_by_ball (
  match_id UUID,
  over_num INT,
  ball_num INT,
  batter_id UUID,
  bowler_id UUID,
  runs INT,
  extra_type extra_enum,
  timestamp TIMESTAMP DEFAULT NOW()
) PARTITION BY LIST (match_id);
  `;

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black mb-2">System Architecture & Schema</h1>
        <p className="text-slate-400">Blueprint of the enterprise-grade multi-tenant sports tech backend.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-2xl border-t-4 border-blue-500">
           <Database className="text-blue-500 mb-4" />
           <h3 className="font-bold mb-1">PostgreSQL + Redis</h3>
           <p className="text-xs text-slate-500">Relational data with sub-millisecond caching for live scores.</p>
        </div>
        <div className="glass-panel p-6 rounded-2xl border-t-4 border-green-500">
           <Server className="text-green-500 mb-4" />
           <h3 className="font-bold mb-1">Node.js Microservices</h3>
           <p className="text-xs text-slate-500">Distributed API layer for scaling to millions of concurrent users.</p>
        </div>
        <div className="glass-panel p-6 rounded-2xl border-t-4 border-purple-500">
           <Cpu className="text-purple-500 mb-4" />
           <h3 className="font-bold mb-1">Python AI Engine</h3>
           <p className="text-xs text-slate-500">Powered by Gemini for predictions and dynamic commentary.</p>
        </div>
        <div className="glass-panel p-6 rounded-2xl border-t-4 border-orange-500">
           <Globe className="text-orange-500 mb-4" />
           <h3 className="font-bold mb-1">AWS / Cloudflare Edge</h3>
           <p className="text-xs text-slate-500">Global content delivery and low-latency WebSocket clusters.</p>
        </div>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden">
        <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
           <span className="text-xs font-black uppercase tracking-widest text-slate-400">SQL Database Schema Blueprint</span>
           <span className="text-[10px] bg-blue-500/10 text-blue-500 px-2 py-1 rounded font-bold">v2.4 Production Stable</span>
        </div>
        <pre className="p-8 text-[11px] font-mono leading-relaxed text-blue-300 overflow-x-auto">
          {sqlSchema}
        </pre>
      </div>
    </div>
  );
};

export default SchemaViewer;
