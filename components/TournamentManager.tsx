
import React, { useState } from 'react';
import { 
  Trophy, Users, Plus, Swords, Calendar, Shield, 
  ChevronRight, PlayCircle, AlertCircle, Gavel, 
  DollarSign, Clock, CalendarClock, CheckCircle2, UserPlus,
  ArrowLeftRight, AlertTriangle, Target, Mic, BarChart3, User,
  Edit2, Trash2, Save, X, MoreHorizontal, Lock, Medal, Crown, Flag,
  Activity, Zap, Hash, BarChart, TrendingUp, Table2, List
} from 'lucide-react';
import { getAICommentary } from '../geminiService';

// --- Types ---

interface GlobalPlayer {
  id: string;
  name: string;
  role: 'Batsman' | 'Bowler' | 'All-Rounder' | 'Wicket-Keeper';
  avatarColor: string;
  basePrice: number; // For Auction
  soldPrice?: number;
  isSold?: boolean;
  teamId?: string; // If assigned
  stats?: {
    matches: number;
    runs: number;
    wickets: number;
    avg: number;
    strikeRate: number;
  }
}

interface PlayerMatchStats {
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  wickets: number;
  runsConceded: number;
  ballsBowled: number;
  dots: number;
}

interface Team {
  id: string;
  name: string;
  shortName: string;
  group: 'A' | 'B' | 'None';
  playerIds: string[];
  purseRemaining: number; // For Auction
  stats?: {
      wins: number;
      losses: number;
      nrr: string;
  }
}

interface Match {
  id: string;
  round: string;
  teamAId: string;
  teamBId: string;
  winnerId: string | null;
  pomId: string | null; // Player of the Match
  status: 'Scheduled' | 'Live' | 'Completed' | 'Break';
  innings: 1 | 2;
  target?: number;
  
  // Score Data
  scoreA: string; // Team A Score (or Batting Team Score)
  oversA: string;
  scoreB: string; // Team B Score (or Bowling Team Score stored for history)
  oversB: string;
  
  // Current State
  battingTeamId: string;
  bowlingTeamId: string;
  
  currentBatters: { strikerId: string | null; nonStrikerId: string | null };
  currentBowlerId: string | null;
  
  // Individual Player Tracking
  playerStats: Record<string, PlayerMatchStats>;

  breakType?: 'Drinks' | 'Innings' | null;
  date?: string; 
  time?: string;
  commentaryLog?: {
      text: string;
      run: number;
      isWicket: boolean;
      ball: string;
      batterName?: string;
      bowlerName?: string;
  }[]; 
}

interface Tournament {
  id: string;
  name: string;
  format: 'T20' | 'ODI' | 'Test';
  location: string;
  status: 'Upcoming' | 'Live' | 'Completed';
  auctionEnabled: boolean;
  potId: string | null; // Player of the Tournament
  teams: Team[];
  matches: Match[];
  playerPool: GlobalPlayer[];
}

type DeliveryType = 'Legal' | 'Wide' | 'NoBall';
type ShotZone = 'Cover' | 'Long On' | 'Long Off' | 'Mid Wicket' | 'Square Leg' | 'Third Man' | 'Fine Leg' | 'Point' | 'Slips';
type ShotType = 'Drive' | 'Pull' | 'Cut' | 'Loft' | 'Defensive' | 'Sweep' | 'Scoop';
type WicketType = 'Bowled' | 'Caught' | 'LBW' | 'Run Out' | 'Stumped' | 'Hit Wicket';

const TournamentManager: React.FC = () => {
  // --- Global State ---
  const [tournaments, setTournaments] = useState<Tournament[]>([
    {
      id: 't1',
      name: 'Premier League 2025',
      format: 'T20',
      location: 'Mumbai',
      status: 'Live',
      auctionEnabled: false,
      potId: null,
      teams: [
        { 
            id: 'tm1', name: 'Mumbai Indians', shortName: 'MI', group: 'A', playerIds: ['gp1', 'gp2', 'gp4', 'gp5'], purseRemaining: 100,
            stats: { wins: 4, losses: 1, nrr: "+1.240" }
        },
        { 
            id: 'tm2', name: 'Chennai Kings', shortName: 'CSK', group: 'A', playerIds: ['gp3', 'gp6', 'gp7'], purseRemaining: 100,
            stats: { wins: 3, losses: 2, nrr: "+0.850" }
        }
      ],
      playerPool: [],
      matches: []
    }
  ]);

  // Global Mock Players
  const [globalRegistry, setGlobalRegistry] = useState<GlobalPlayer[]>([
    { id: 'gp1', name: 'Virat Kohli', role: 'Batsman', avatarColor: 'bg-red-500', basePrice: 2.0, stats: { matches: 240, runs: 12000, wickets: 4, avg: 51.5, strikeRate: 138.2 } },
    { id: 'gp2', name: 'Jasprit Bumrah', role: 'Bowler', avatarColor: 'bg-blue-500', basePrice: 2.0, stats: { matches: 120, runs: 150, wickets: 145, avg: 8.5, strikeRate: 98.0 } },
    { id: 'gp3', name: 'Ben Stokes', role: 'All-Rounder', avatarColor: 'bg-purple-500', basePrice: 1.5, stats: { matches: 160, runs: 4000, wickets: 90, avg: 35.0, strikeRate: 145.5 } },
    { id: 'gp4', name: 'Rohit Sharma', role: 'Batsman', avatarColor: 'bg-blue-600', basePrice: 2.0, stats: { matches: 235, runs: 10500, wickets: 1, avg: 49.0, strikeRate: 140.1 } },
    { id: 'gp5', name: 'Hardik Pandya', role: 'All-Rounder', avatarColor: 'bg-blue-400', basePrice: 1.5, stats: { matches: 130, runs: 2500, wickets: 60, avg: 29.5, strikeRate: 155.2 } },
    { id: 'gp6', name: 'MS Dhoni', role: 'Wicket-Keeper', avatarColor: 'bg-yellow-500', basePrice: 2.0, stats: { matches: 250, runs: 5000, wickets: 0, avg: 40.0, strikeRate: 136.8 } },
    { id: 'gp7', name: 'Ravindra Jadeja', role: 'All-Rounder', avatarColor: 'bg-yellow-600', basePrice: 1.5, stats: { matches: 200, runs: 3000, wickets: 200, avg: 30.0, strikeRate: 128.4 } },
  ]);

  // --- UI State ---
  const [activeView, setActiveView] = useState<'List' | 'Details' | 'Scorer' | 'AuctionConsole' | 'Profile' | 'MatchDetails'>('List');
  const [profileType, setProfileType] = useState<'Tournament' | 'Team' | 'Player'>('Tournament');
  const [profileDataId, setProfileDataId] = useState<string | null>(null);

  const [selectedTournamentId, setSelectedTournamentId] = useState<string | null>(null);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<'Points' | 'Fixtures' | 'Teams' | 'Registry'>('Fixtures');

  // Editing State
  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [editTeamName, setEditTeamName] = useState('');
  const [editTeamGroup, setEditTeamGroup] = useState<'A'|'B'|'None'>('A');

  // Scorer Inputs
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('Legal');
  const [selectedRuns, setSelectedRuns] = useState<number>(0);
  const [isWicket, setIsWicket] = useState(false);
  const [wicketType, setWicketType] = useState<WicketType>('Caught');
  const [shotZone, setShotZone] = useState<ShotZone>('Cover');
  const [shotType, setShotType] = useState<ShotType>('Drive');
  const [fielderName, setFielderName] = useState('');
  const [isProcessingBall, setIsProcessingBall] = useState(false);
  
  // End Match/Innings State
  const [showEndMatchModal, setShowEndMatchModal] = useState(false);
  const [selectedWinnerId, setSelectedWinnerId] = useState<string>('');
  const [selectedPomId, setSelectedPomId] = useState<string>('');

  // Forms
  const [newTourneyName, setNewTourneyName] = useState('');
  const [isAuctionEnabled, setIsAuctionEnabled] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamGroup, setNewTeamGroup] = useState<'A'|'B'|'None'>('A');
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerRole, setNewPlayerRole] = useState('Batsman');
  const [fixtureTeamA, setFixtureTeamA] = useState('');
  const [fixtureTeamB, setFixtureTeamB] = useState('');
  const [fixtureDate, setFixtureDate] = useState('');

  // --- Helper Functions ---
  const getTeam = (tId: string, tourney: Tournament) => tourney.teams.find(t => t.id === tId);
  const getPlayer = (pId: string, tourney: Tournament) => {
    return tourney.playerPool.find(p => p.id === pId) || globalRegistry.find(p => p.id === pId);
  };
  const getPlayerName = (pId: string | null, tourney: Tournament) => {
      if(!pId) return "Select Player";
      return getPlayer(pId, tourney)?.name || "Unknown";
  }

  // --- Actions ---

  const addTournament = () => {
    if (!newTourneyName) return;
    const newT: Tournament = {
      id: Date.now().toString(),
      name: newTourneyName,
      format: 'T20',
      location: 'TBD',
      status: 'Upcoming',
      auctionEnabled: isAuctionEnabled,
      potId: null,
      teams: [],
      matches: [],
      playerPool: []
    };
    setTournaments([...tournaments, newT]);
    setNewTourneyName('');
    setIsAuctionEnabled(false);
  };

  const addTeam = () => {
    if (!selectedTournamentId || !newTeamName) return;
    const newTeam: Team = {
      id: Date.now().toString(),
      name: newTeamName,
      shortName: newTeamName.substring(0, 3).toUpperCase(),
      group: newTeamGroup,
      playerIds: [],
      purseRemaining: 100,
      stats: { wins: 0, losses: 0, nrr: "0.000" }
    };
    setTournaments(prev => prev.map(t => t.id === selectedTournamentId ? { ...t, teams: [...t.teams, newTeam] } : t));
    setNewTeamName('');
  };

  const updateTournamentStatus = (tourneyId: string, status: 'Upcoming' | 'Live' | 'Completed') => {
      setTournaments(prev => prev.map(t => t.id === tourneyId ? { ...t, status } : t));
  };

  const updateTeamDetails = (teamId: string) => {
      if(!selectedTournamentId) return;
      setTournaments(prev => prev.map(t => {
          if(t.id !== selectedTournamentId) return t;
          return {
              ...t,
              teams: t.teams.map(team => team.id === teamId ? { ...team, name: editTeamName, shortName: editTeamName.substring(0, 3).toUpperCase(), group: editTeamGroup } : team)
          }
      }));
      setIsEditingTeam(false);
  };

  const removePlayerFromTeam = (teamId: string, playerId: string) => {
      if (!selectedTournamentId) return;
      
      setTournaments(prev => prev.map(t => {
          if (t.id !== selectedTournamentId) return t;
          const updatedTeams = t.teams.map(team => {
              if (team.id !== teamId) return team;
              return { ...team, playerIds: team.playerIds.filter(id => id !== playerId) };
          });
          const updatedPool = t.playerPool.map(p => {
              if (p.id !== playerId) return p;
              return { ...p, teamId: undefined, isSold: false };
          });
          return { ...t, teams: updatedTeams, playerPool: updatedPool };
      }));

      setGlobalRegistry(prev => prev.map(p => {
          if(p.id !== playerId) return p;
          return { ...p, teamId: undefined, isSold: false };
      }));
  };

  const registerPlayer = (targetTeamId?: string) => {
    if (!newPlayerName || !selectedTournamentId) return;
    const newPlayer: GlobalPlayer = {
      id: `np${Date.now()}`,
      name: newPlayerName,
      role: newPlayerRole as any,
      avatarColor: `bg-${['blue', 'green', 'purple', 'orange', 'red'][Math.floor(Math.random()*5)]}-500`,
      basePrice: 0.5,
      isSold: !!targetTeamId,
      teamId: targetTeamId,
      stats: { matches: 0, runs: 0, wickets: 0, avg: 0, strikeRate: 0 }
    };

    setTournaments(prev => prev.map(t => {
      if (t.id !== selectedTournamentId) return t;
      if (targetTeamId) {
        const updatedTeams = t.teams.map(team => {
            if (team.id !== targetTeamId) return team;
            return { ...team, playerIds: [...team.playerIds, newPlayer.id] };
        });
        return { ...t, teams: updatedTeams, playerPool: [...t.playerPool, newPlayer] };
      }
      return { ...t, playerPool: [...t.playerPool, newPlayer] };
    }));
    setNewPlayerName('');
  };

  // --- Scorer Logic ---

  const endInnings = () => {
    if (!selectedTournamentId || !selectedMatchId) return;
    setTournaments(prev => prev.map(t => {
        if (t.id !== selectedTournamentId) return t;
        return {
            ...t,
            matches: t.matches.map(m => {
                if(m.id !== selectedMatchId) return m;
                
                // Calculate Target
                const runs = parseInt(m.scoreA.split('/')[0]);
                const target = runs + 1;

                return {
                    ...m,
                    innings: 2,
                    target: target,
                    // Swap Batting/Bowling
                    battingTeamId: m.bowlingTeamId,
                    bowlingTeamId: m.battingTeamId,
                    // Archive 1st innings score to scoreB for storage, clear scoreA for new innings
                    scoreB: m.scoreA, 
                    oversB: m.oversA,
                    scoreA: '0/0',
                    oversA: '0.0',
                    currentBatters: { strikerId: null, nonStrikerId: null },
                    currentBowlerId: null,
                    commentaryLog: [{
                        text: `Innings Break! Target set: ${target}`,
                        run: 0, isWicket: false, ball: "0.0",
                    }, ...(m.commentaryLog || [])]
                }
            })
        }
    }));
  };

  const endMatch = () => {
      if (!selectedTournamentId || !selectedMatchId || !selectedWinnerId || !selectedPomId) return;
      
      setTournaments(prev => prev.map(t => {
          if (t.id !== selectedTournamentId) return t;
          return {
              ...t,
              matches: t.matches.map(m => {
                  if(m.id !== selectedMatchId) return m;
                  return {
                      ...m,
                      status: 'Completed',
                      winnerId: selectedWinnerId,
                      pomId: selectedPomId,
                      commentaryLog: [{
                          text: `MATCH CONCLUDED. Winner: ${selectedWinnerId === m.teamAId ? getTeam(m.teamAId, t)?.name : getTeam(m.teamBId, t)?.name}`,
                          run: 0, isWicket: false, ball: "END"
                      }, ...(m.commentaryLog || [])]
                  }
              })
          }
      }));
      setShowEndMatchModal(false);
  };

  const updateMatchPlayers = (strikerId: string, nonStrikerId: string, bowlerId: string) => {
      if (!selectedTournamentId || !selectedMatchId) return;
      setTournaments(prev => prev.map(t => {
          if (t.id !== selectedTournamentId) return t;
          return {
              ...t,
              matches: t.matches.map(m => m.id === selectedMatchId ? {
                  ...m,
                  currentBatters: { strikerId: strikerId || m.currentBatters.strikerId, nonStrikerId: nonStrikerId || m.currentBatters.nonStrikerId },
                  currentBowlerId: bowlerId || m.currentBowlerId
              } : m)
          }
      }));
  }

  const submitBall = async () => {
    if (!selectedTournamentId || !selectedMatchId) return;
    setIsProcessingBall(true);
    
    const tournament = tournaments.find(t => t.id === selectedTournamentId);
    const match = tournament?.matches.find(m => m.id === selectedMatchId);
    if (!tournament || !match) return;

    const strikerId = match.currentBatters.strikerId;
    const bowlerId = match.currentBowlerId;

    const batterName = getPlayerName(strikerId, tournament);
    const bowlerName = getPlayerName(bowlerId, tournament);

    // AI Commentary Generation
    let aiText = "Processing...";
    try {
        const context = {
            runs: selectedRuns + (deliveryType !== 'Legal' ? 1 : 0),
            shotType: deliveryType === 'Legal' ? shotType : 'Extras',
            shotZone: deliveryType === 'Legal' ? shotZone : 'N/A',
            fielder: fielderName || 'No fielder',
            wicketType: isWicket ? wicketType : null,
            score: match.scoreA,
            batter: batterName,
            bowler: bowlerName
        };
        aiText = await getAICommentary(context, "English");
    } catch(e) {
        aiText = "Technical glitch in commentary box.";
    }

    // Update Match State
    let [currentRuns, currentWickets] = match.scoreA.split('/').map(Number);
    let [overs, balls] = match.oversA.split('.').map(Number);
    let currentBatters = { ...match.currentBatters };
    let playerStats = { ...match.playerStats };

    let totalRuns = selectedRuns;
    if (deliveryType !== 'Legal') totalRuns += 1;
    
    currentRuns += totalRuns;
    if (isWicket && deliveryType === 'Legal') currentWickets += 1;
    
    if (deliveryType === 'Legal') {
        balls += 1;
        // Update Individual Stats
        if (strikerId) {
            const s = playerStats[strikerId] || { runs: 0, balls: 0, fours: 0, sixes: 0, wickets: 0, runsConceded: 0, ballsBowled: 0, dots: 0 };
            s.runs += selectedRuns;
            s.balls += 1;
            if (selectedRuns === 4) s.fours += 1;
            if (selectedRuns === 6) s.sixes += 1;
            playerStats[strikerId] = s;
        }
        if (bowlerId) {
            const b = playerStats[bowlerId] || { runs: 0, balls: 0, fours: 0, sixes: 0, wickets: 0, runsConceded: 0, ballsBowled: 0, dots: 0 };
            b.runsConceded += selectedRuns;
            b.ballsBowled += 1;
            if (selectedRuns === 0 && !isWicket) b.dots += 1;
            if (isWicket) b.wickets += 1;
            playerStats[bowlerId] = b;
        }
    } else if (deliveryType === 'Wide' || deliveryType === 'NoBall') {
        if (bowlerId) {
            const b = playerStats[bowlerId] || { runs: 0, balls: 0, fours: 0, sixes: 0, wickets: 0, runsConceded: 0, ballsBowled: 0, dots: 0 };
            b.runsConceded += totalRuns;
            playerStats[bowlerId] = b;
        }
    }

    // Strike Rotation
    if (selectedRuns % 2 !== 0) {
        const temp = currentBatters.strikerId;
        currentBatters.strikerId = currentBatters.nonStrikerId;
        currentBatters.nonStrikerId = temp;
    }

    if (balls === 6) {
        balls = 0; overs += 1;
        const temp = currentBatters.strikerId;
        currentBatters.strikerId = currentBatters.nonStrikerId;
        currentBatters.nonStrikerId = temp;
    }

    // Handle Wicket: Reset Striker if wicket fell
    if(isWicket) {
        currentBatters.strikerId = null; 
    }

    const newLogItem = {
        text: aiText,
        run: totalRuns,
        isWicket: isWicket,
        ball: `${overs}.${balls}`,
        batterName: batterName,
        bowlerName: bowlerName
    };

    setTournaments(prev => prev.map(t => {
      if (t.id !== selectedTournamentId) return t;
      return { 
          ...t, 
          matches: t.matches.map(m => m.id === selectedMatchId ? { 
              ...m, 
              scoreA: `${currentRuns}/${currentWickets}`,
              oversA: `${overs}.${balls}`,
              currentBatters,
              playerStats,
              commentaryLog: [newLogItem, ...(m.commentaryLog || [])].slice(0, 50)
          } : m) 
      };
    }));

    // Reset Form
    setIsProcessingBall(false);
    setDeliveryType('Legal');
    setSelectedRuns(0);
    setIsWicket(false);
    setFielderName('');
  };

  // --- Views ---

  const renderProfile = () => {
      const tourney = tournaments.find(t => t.id === selectedTournamentId);
      if (!tourney) return null;
      const isLocked = tourney.status === 'Completed';

      let content = null;
      let title = "";
      let subtitle = "";

      if (profileType === 'Tournament') {
          title = tourney.name;
          subtitle = `${tourney.format} • ${tourney.location}`;
          content = (
              <div className="space-y-6">
                  {/* Status Control */}
                  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
                     <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1">Tournament Status</h4>
                        <p className="text-xs text-slate-500">Manage event visibility and live features.</p>
                     </div>
                     <select 
                        value={tourney.status}
                        onChange={(e) => updateTournamentStatus(tourney.id, e.target.value as any)}
                        className={`bg-slate-950 px-4 py-2 rounded-xl text-xs font-black uppercase border border-slate-800 outline-none ${
                            tourney.status === 'Live' ? 'text-red-500 shadow-red-500/10' :
                            tourney.status === 'Completed' ? 'text-green-500' : 'text-slate-400'
                        }`}
                     >
                         <option value="Upcoming">Upcoming</option>
                         <option value="Live">Live</option>
                         <option value="Completed">Completed</option>
                     </select>
                  </div>

                  {/* Player of Tournament Section (Visible only when Completed) */}
                  {tourney.status === 'Completed' && (
                      <div className="bg-gradient-to-r from-yellow-600/20 to-slate-900 p-6 rounded-2xl border border-yellow-600/30 relative overflow-hidden">
                          <div className="relative z-10 flex items-center justify-between">
                             <div>
                                <h3 className="text-xl font-black text-white italic flex items-center gap-2">
                                    <Crown size={24} className="text-yellow-400" />
                                    PLAYER OF THE TOURNAMENT
                                </h3>
                                {tourney.potId ? (
                                    <div className="mt-4 flex items-center gap-4">
                                        <div className={`w-16 h-16 rounded-2xl ${getPlayer(tourney.potId, tourney)?.avatarColor} flex items-center justify-center text-2xl font-black text-white`}>
                                            {getPlayer(tourney.potId, tourney)?.name[0]}
                                        </div>
                                        <div>
                                            <p className="text-2xl font-black text-yellow-400">{getPlayer(tourney.potId, tourney)?.name}</p>
                                            <p className="text-xs font-bold text-slate-400 uppercase">MVP Award Winner</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-4 flex items-center gap-2">
                                        <select 
                                            className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-xs font-bold text-white outline-none"
                                            onChange={(e) => {
                                                if(e.target.value) {
                                                    setTournaments(prev => prev.map(t => t.id === tourney.id ? { ...t, potId: e.target.value } : t));
                                                }
                                            }}
                                        >
                                            <option value="">Select MVP Player...</option>
                                            {tourney.playerPool.map(p => (
                                                <option key={p.id} value={p.id}>{p.name} ({getTeam(p.teamId!, tourney)?.name})</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                             </div>
                             <Trophy size={100} className="text-yellow-500/10 absolute -right-4 -bottom-4 rotate-12" />
                          </div>
                      </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-center">
                          <p className="text-xs text-slate-500 uppercase font-bold">Total Teams</p>
                          <p className="text-2xl font-black text-white">{tourney.teams.length}</p>
                      </div>
                      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-center">
                          <p className="text-xs text-slate-500 uppercase font-bold">Matches</p>
                          <p className="text-2xl font-black text-white">{tourney.matches.length}</p>
                      </div>
                      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-center">
                          <p className="text-xs text-slate-500 uppercase font-bold">Total Runs</p>
                          <p className="text-2xl font-black text-green-400">12,450</p>
                      </div>
                      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-center">
                          <p className="text-xs text-slate-500 uppercase font-bold">Wickets</p>
                          <p className="text-2xl font-black text-red-400">452</p>
                      </div>
                  </div>
                  <div className="glass-panel p-6 rounded-2xl">
                      <h3 className="font-bold mb-4 uppercase tracking-widest text-xs text-slate-500">Points Table</h3>
                      <table className="w-full text-left text-sm">
                          <thead className="text-slate-500 border-b border-slate-800">
                              <tr><th className="pb-2">Team</th><th className="pb-2">M</th><th className="pb-2">W</th><th className="pb-2">L</th><th className="pb-2 text-right">NRR</th></tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                              {tourney.teams.map(team => (
                                  <tr key={team.id} className="group hover:bg-slate-900 cursor-pointer" onClick={() => { setProfileType('Team'); setProfileDataId(team.id); }}>
                                      <td className="py-3 font-bold group-hover:text-indigo-400">{team.name}</td>
                                      <td className="py-3 text-slate-400">5</td>
                                      <td className="py-3 text-white">{team.stats?.wins}</td>
                                      <td className="py-3 text-slate-400">{team.stats?.losses}</td>
                                      <td className="py-3 text-right font-mono text-green-400">{team.stats?.nrr}</td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          );
      } else if (profileType === 'Team') {
          const team = tourney.teams.find(t => t.id === profileDataId);
          if (!team) return <div>Team not found</div>;
          title = isEditingTeam ? "Edit Team" : team.name;
          subtitle = isEditingTeam ? "Update team details below" : `Group ${team.group} • Squad: ${team.playerIds.length}`;
          
          content = (
              <div className="space-y-6">
                 {/* Team Info & Edit Controls */}
                 {isEditingTeam ? (
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase">Team Name</label>
                                <input 
                                    value={editTeamName}
                                    onChange={(e) => setEditTeamName(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-indigo-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase">Group</label>
                                <select 
                                    value={editTeamGroup}
                                    onChange={(e) => setEditTeamGroup(e.target.value as any)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-indigo-500"
                                >
                                    <option value="A">Group A</option>
                                    <option value="B">Group B</option>
                                    <option value="None">No Group</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                            <button onClick={() => setIsEditingTeam(false)} className="px-4 py-2 rounded-xl text-xs font-black text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700">Cancel</button>
                            <button onClick={() => updateTeamDetails(team.id)} className="px-4 py-2 rounded-xl text-xs font-black text-white bg-green-600 hover:bg-green-500 flex items-center gap-2">
                                <Save size={14} /> Save Changes
                            </button>
                        </div>
                    </div>
                 ) : (
                    <div className="flex justify-end">
                         {!isLocked && (
                             <button 
                                onClick={() => {
                                    setIsEditingTeam(true);
                                    setEditTeamName(team.name);
                                    setEditTeamGroup(team.group);
                                }}
                                className="bg-slate-900 hover:bg-slate-800 text-indigo-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-slate-800"
                             >
                                <Edit2 size={12} /> Edit Team
                             </button>
                         )}
                         {isLocked && (
                             <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-slate-500 text-[10px] font-black uppercase border border-slate-800">
                                 <Lock size={12} /> Team Locked (Tournament Completed)
                             </div>
                         )}
                    </div>
                 )}

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-panel p-6 rounded-2xl h-fit">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold uppercase tracking-widest text-xs text-slate-500 flex items-center gap-2">
                                Squad List
                                {isEditingTeam && <span className="text-red-400 bg-red-500/10 px-2 py-0.5 rounded">Editing</span>}
                            </h3>
                        </div>
                        
                        {/* Add Player Input in Profile View */}
                        {!isLocked && !isEditingTeam && (
                            <div className="mb-4 flex gap-2">
                                <input 
                                    placeholder="Add Player to Squad..." 
                                    value={newPlayerName} 
                                    onChange={e => setNewPlayerName(e.target.value)} 
                                    className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-[10px] text-white w-full focus:border-indigo-500 outline-none" 
                                />
                                <button onClick={() => registerPlayer(team.id)} className="bg-indigo-600 text-white px-3 rounded-lg text-[10px] font-black hover:bg-indigo-500 transition-colors">
                                    <Plus size={14} />
                                </button>
                            </div>
                        )}

                        <div className="space-y-2">
                            {team.playerIds.map(pid => {
                                const p = getPlayer(pid, tourney);
                                if(!p) return null;
                                return (
                                    <div key={pid} className="flex items-center justify-between p-2 hover:bg-slate-900 rounded-lg group transition-colors">
                                        <div 
                                            onClick={() => !isEditingTeam && (setProfileType('Player'), setProfileDataId(pid))}
                                            className={`flex items-center gap-3 ${!isEditingTeam ? 'cursor-pointer' : ''}`}
                                        >
                                            <div className={`w-8 h-8 rounded-lg ${p.avatarColor} flex items-center justify-center font-bold text-xs text-white`}>{p.name[0]}</div>
                                            <div>
                                                <div className="font-bold text-sm text-white group-hover:text-indigo-400">{p.name}</div>
                                                <div className="text-[10px] text-slate-500 font-bold uppercase">{p.role}</div>
                                            </div>
                                        </div>
                                        {isEditingTeam && (
                                            <button 
                                                onClick={() => removePlayerFromTeam(team.id, pid)}
                                                className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                title="Remove Player"
                                            >
                                                <X size={14} />
                                            </button>
                                        )}
                                    </div>
                                )
                            })}
                            {team.playerIds.length === 0 && (
                                <div className="text-center py-6 text-slate-600 text-xs italic">No players in squad.</div>
                            )}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                            <h4 className="text-slate-400 text-xs font-bold uppercase mb-2">Team Form</h4>
                            <div className="flex gap-2">
                                {['W','W','L','W','L'].map((r,i) => (
                                    <span key={i} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${r === 'W' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{r}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                 </div>
              </div>
          );
      } else if (profileType === 'Player') {
          const player = getPlayer(profileDataId!, tourney);
          if (!player) return <div>Player not found</div>;
          
          // Check for LIVE match performance
          const liveMatch = tourney.matches.find(m => m.status === 'Live' && (m.teamAId === player.teamId || m.teamBId === player.teamId));
          const liveStats = liveMatch ? liveMatch.playerStats[player.id] : null;

          title = player.name;
          subtitle = `${player.role} • ${getTeam(player.teamId!, tourney)?.name || 'Free Agent'}`;
          
          content = (
              <div className="space-y-6">
                 {/* Live Match Performance Tracking */}
                 {liveStats && (
                     <div className="bg-gradient-to-br from-indigo-900/40 to-slate-950 p-8 rounded-[3rem] border border-indigo-500/30 relative overflow-hidden animate-in zoom-in-95">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Activity size={120} className="text-indigo-400" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-red-600 rounded-lg text-white animate-pulse">
                                    <Zap size={18} />
                                </div>
                                <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">Live Match Tracker</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Batting Stats */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end border-b border-slate-800 pb-2">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Batting</p>
                                        <p className="text-sm font-black text-indigo-400 uppercase tracking-tighter">Innings Active</p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="text-center">
                                            <p className="text-[10px] text-slate-500 font-bold uppercase">Runs (Balls)</p>
                                            <p className="text-3xl font-black text-white tracking-tighter">{liveStats.runs} <span className="text-sm text-slate-600 font-bold">({liveStats.balls})</span></p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] text-slate-500 font-bold uppercase">Strike Rate</p>
                                            <p className="text-2xl font-black text-green-400 tracking-tighter">
                                                {liveStats.balls > 0 ? ((liveStats.runs / liveStats.balls) * 100).toFixed(1) : "0.0"}
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] text-slate-500 font-bold uppercase">4s / 6s</p>
                                            <p className="text-2xl font-black text-white tracking-tighter">{liveStats.fours} / {liveStats.sixes}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Bowling Stats */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end border-b border-slate-800 pb-2">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Bowling</p>
                                        <p className="text-sm font-black text-slate-400 uppercase tracking-tighter">Spell Underway</p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="text-center">
                                            <p className="text-[10px] text-slate-500 font-bold uppercase">Wkts / Runs</p>
                                            <p className="text-3xl font-black text-red-500 tracking-tighter">{liveStats.wickets}/{liveStats.runsConceded}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] text-slate-500 font-bold uppercase">Economy</p>
                                            <p className="text-2xl font-black text-white tracking-tighter">
                                                {liveStats.ballsBowled > 0 ? ((liveStats.runsConceded / (liveStats.ballsBowled / 6)) || 0).toFixed(2) : "0.00"}
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] text-slate-500 font-bold uppercase">Dots</p>
                                            <p className="text-2xl font-black text-indigo-400 tracking-tighter">{liveStats.dots}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                     </div>
                 )}

                 <div className="flex gap-6 items-start">
                    <div className={`w-24 h-24 rounded-[2rem] ${player.avatarColor} flex items-center justify-center text-5xl font-black text-white shadow-2xl relative`}>
                        {player.name[0]}
                        {liveMatch && <div className="absolute -top-2 -right-2 bg-red-600 w-6 h-6 rounded-full flex items-center justify-center border-2 border-slate-950"><Activity size={12} className="text-white" /></div>}
                    </div>
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-center">
                            <p className="text-[10px] text-slate-500 font-bold uppercase">Matches</p>
                            <p className="text-xl font-black text-white">{player.stats?.matches}</p>
                        </div>
                        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-center">
                            <p className="text-[10px] text-slate-500 font-bold uppercase">Runs</p>
                            <p className="text-xl font-black text-white">{player.stats?.runs}</p>
                        </div>
                        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-center">
                            <p className="text-[10px] text-slate-500 font-bold uppercase">Wickets</p>
                            <p className="text-xl font-black text-white">{player.stats?.wickets}</p>
                        </div>
                        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-center">
                            <p className="text-[10px] text-slate-500 font-bold uppercase">Avg / SR</p>
                            <p className="text-xl font-black text-green-400">{player.stats?.avg} <span className="text-[10px] text-slate-600">/ {player.stats?.strikeRate}</span></p>
                        </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 glass-panel p-6 rounded-2xl">
                        <h3 className="font-bold mb-4 uppercase tracking-widest text-xs text-slate-500 flex items-center gap-2">
                            <BarChart size={14} /> Career Performance Analysis
                        </h3>
                        <div className="h-48 flex items-end gap-2 border-b border-slate-800 pb-2">
                            {[45, 12, 89, 34, 56, 102, 11, 0, 45, 67, 32, 90].map((h, i) => (
                                <div key={i} style={{height: `${h}%`}} className={`flex-1 ${h > 80 ? 'bg-indigo-500' : 'bg-slate-800'} hover:bg-indigo-400 rounded-t-sm transition-all group relative`}>
                                    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-slate-900 text-[8px] font-black px-1.5 py-0.5 rounded pointer-events-none">{h}</div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-2 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                            <span>2024 Seasons</span>
                            <span>Latest Performance</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                           <h3 className="font-bold mb-4 uppercase tracking-widest text-[10px] text-slate-500 flex items-center gap-2">
                               <TrendingUp size={14} /> Player Form
                           </h3>
                           <div className="space-y-3">
                              <div className="flex justify-between text-xs items-center">
                                 <span className="text-slate-400 font-bold">Consistency</span>
                                 <span className="text-white font-black">82%</span>
                              </div>
                              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                                 <div className="bg-emerald-500 h-full w-[82%]"></div>
                              </div>
                              <div className="flex justify-between text-xs items-center pt-2">
                                 <span className="text-slate-400 font-bold">Explosivity</span>
                                 <span className="text-white font-black">74%</span>
                              </div>
                              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                                 <div className="bg-indigo-500 h-full w-[74%]"></div>
                              </div>
                           </div>
                        </div>
                    </div>
                 </div>
              </div>
          );
      }

      return (
          <div className="animate-in slide-in-from-right space-y-6">
              <div className="flex justify-between items-center bg-slate-950 p-6 rounded-[2.5rem] border border-slate-900">
                  <div>
                      <h2 className="text-3xl font-black uppercase italic">{title}</h2>
                      <p className="text-slate-500 font-bold">{subtitle}</p>
                  </div>
                  <button onClick={() => { setActiveView('Details'); setProfileType('Tournament'); setIsEditingTeam(false); }} className="px-6 py-3 bg-slate-900 rounded-xl font-black text-xs uppercase hover:bg-slate-800">
                      Close Profile
                  </button>
              </div>
              {content}
          </div>
      );
  };

  const renderMatchDetails = () => {
    const tourney = tournaments.find(t => t.id === selectedTournamentId);
    const match = tourney?.matches.find(m => m.id === selectedMatchId);
    if (!tourney || !match) return null;

    const teamA = getTeam(match.teamAId, tourney);
    const teamB = getTeam(match.teamBId, tourney);
    const winner = match.winnerId ? getTeam(match.winnerId, tourney) : null;
    const pom = match.pomId ? getPlayer(match.pomId, tourney) : null;
    const activePlayerIds = Object.keys(match.playerStats || {});

    return (
        <div className="space-y-6 animate-in slide-in-from-right">
             <div className="flex justify-between items-center bg-slate-950 p-6 rounded-[2.5rem] border border-slate-900">
                  <div>
                      <h2 className="text-2xl font-black uppercase italic text-white">Match Center</h2>
                      <p className="text-slate-500 font-bold text-xs">{teamA?.name} vs {teamB?.name}</p>
                  </div>
                  <button onClick={() => { setActiveView('Details'); setDetailTab('Fixtures'); }} className="px-6 py-3 bg-slate-900 rounded-xl font-black text-xs uppercase hover:bg-slate-800 flex items-center gap-2">
                      <ChevronRight className="rotate-180" size={14} /> Back to Fixtures
                  </button>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-[2.5rem] p-8 relative overflow-hidden">
                   <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="text-center">
                            <h3 className="text-3xl font-black text-white mb-2">{match.scoreA}</h3>
                            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">{teamA?.shortName} (Batting)</p>
                            <p className="text-xs text-slate-600 mt-1">{match.oversA} Overs</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-4xl font-black text-slate-700">VS</span>
                            <span className={`mt-2 px-3 py-1 rounded text-[10px] font-black uppercase ${match.status === 'Live' ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-800 text-slate-500'}`}>{match.status}</span>
                        </div>
                        <div className="text-center">
                            <h3 className="text-3xl font-black text-white mb-2">{match.scoreB}</h3>
                            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">{teamB?.shortName}</p>
                            <p className="text-xs text-slate-600 mt-1">{match.oversB} Overs</p>
                        </div>
                   </div>
                   
                   {match.status === 'Completed' && (
                       <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
                           <div className="flex items-center gap-4">
                               <Trophy className="text-yellow-500" size={24} />
                               <div>
                                   <p className="text-xs text-slate-500 font-bold uppercase">Winner</p>
                                   <p className="text-xl font-black text-white">{winner?.name || 'Draw'}</p>
                               </div>
                           </div>
                           {pom && (
                               <div className="flex items-center gap-4 bg-slate-900/50 px-6 py-3 rounded-2xl border border-slate-800">
                                   <Medal className="text-orange-400" size={24} />
                                   <div>
                                       <p className="text-[10px] text-slate-500 font-bold uppercase">Player of the Match</p>
                                       <p className="text-sm font-black text-white">{pom.name}</p>
                                   </div>
                               </div>
                           )}
                       </div>
                   )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                   <div className="glass-panel p-6 rounded-2xl">
                       <h3 className="font-bold mb-4 uppercase tracking-widest text-xs text-slate-500 flex items-center gap-2">
                           <Table2 size={14} /> Full Scorecard
                       </h3>
                       <div className="overflow-x-auto">
                           <table className="w-full text-left text-xs">
                               <thead className="text-slate-500 border-b border-slate-800">
                                   <tr>
                                       <th className="pb-2 pl-2">Player</th>
                                       <th className="pb-2">R (B)</th>
                                       <th className="pb-2">4s/6s</th>
                                       <th className="pb-2">O-M-R-W</th>
                                   </tr>
                               </thead>
                               <tbody className="divide-y divide-slate-800">
                                   {activePlayerIds.map(pid => {
                                       const p = getPlayer(pid, tourney);
                                       const s = match.playerStats[pid];
                                       if (!p || !s) return null;
                                       if (s.balls === 0 && s.ballsBowled === 0) return null;

                                       return (
                                           <tr key={pid} className="hover:bg-slate-900/50">
                                               <td className="py-3 pl-2 font-bold text-slate-300">{p.name} <span className="text-[9px] text-slate-600 ml-1">({getTeam(p.teamId, tourney)?.shortName})</span></td>
                                               <td className="py-3 font-mono">
                                                   {s.balls > 0 ? <span className="text-white">{s.runs} <span className="text-slate-500">({s.balls})</span></span> : '-'}
                                               </td>
                                               <td className="py-3 text-slate-500">{s.balls > 0 ? `${s.fours}/${s.sixes}` : '-'}</td>
                                               <td className="py-3 font-mono">
                                                   {s.ballsBowled > 0 ? <span className="text-indigo-400">{Math.floor(s.ballsBowled/6)}.{s.ballsBowled%6}-{0}-{s.runsConceded}-{s.wickets}</span> : '-'}
                                               </td>
                                           </tr>
                                       );
                                   })}
                                   {activePlayerIds.length === 0 && (
                                       <tr><td colSpan={4} className="py-4 text-center text-slate-600 italic">No stats recorded yet.</td></tr>
                                   )}
                               </tbody>
                           </table>
                       </div>
                   </div>

                   <div className="glass-panel p-6 rounded-2xl h-[500px] flex flex-col">
                       <h3 className="font-bold mb-4 uppercase tracking-widest text-xs text-slate-500 flex items-center gap-2">
                           <List size={14} /> Commentary Log
                       </h3>
                       <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                           {match.commentaryLog?.map((log, i) => (
                               <div key={i} className="flex gap-3 text-xs border-b border-slate-800/50 pb-3 last:border-0">
                                   <div className="font-mono font-black text-slate-500 w-8 shrink-0">{log.ball}</div>
                                   <div>
                                       <p className="text-slate-300">{log.text}</p>
                                       {log.isWicket && <span className="text-[9px] font-black text-red-500 uppercase mt-1 inline-block bg-red-500/10 px-1.5 rounded">Wicket</span>}
                                       {(log.run === 4 || log.run === 6) && <span className="text-[9px] font-black text-green-500 uppercase mt-1 inline-block bg-green-500/10 px-1.5 rounded">{log.run} Runs</span>}
                                   </div>
                               </div>
                           ))}
                           {!match.commentaryLog?.length && <div className="text-center text-slate-600 mt-10">No commentary available.</div>}
                       </div>
                   </div>
              </div>
        </div>
    );
  };

  const renderScorer = () => {
    const tourney = tournaments.find(t => t.id === selectedTournamentId);
    const match = tourney?.matches.find(m => m.id === selectedMatchId);
    if (!tourney || !match) return null;
    
    const isLocked = tourney.status === 'Completed' || match.status === 'Completed';

    const battingTeam = getTeam(match.battingTeamId, tourney);
    const bowlingTeam = getTeam(match.bowlingTeamId, tourney);

    return (
      <div className="space-y-6 animate-in slide-in-from-right">
        {/* Header */}
        <div className="flex justify-between items-center bg-slate-950 p-4 rounded-2xl border border-slate-900">
           <div className="flex gap-4 items-center">
               <button onClick={() => { setActiveView('Details'); setDetailTab('Fixtures'); }} className="text-xs font-black text-slate-500 hover:text-white uppercase flex items-center gap-1">
                 <ChevronRight className="rotate-180" size={14} /> Exit Scorer
               </button>
               {match.status === 'Completed' && (
                   <span className="bg-green-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase flex items-center gap-1">
                       <CheckCircle2 size={12} /> Match Completed
                   </span>
               )}
           </div>
           <div className="flex items-center gap-2">
             <Mic className="text-red-500 animate-pulse" size={18} />
             <span className="text-red-500 font-black text-xs uppercase tracking-widest">AI Commentary Live</span>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
           {/* Left: Input Console */}
           <div className="lg:col-span-8 space-y-6">
               <div className="bg-slate-900/50 p-6 rounded-[3rem] border border-slate-800 relative overflow-hidden">
                  
                  {isLocked && !showEndMatchModal && match.status === 'Completed' && (
                      <div className="absolute inset-0 bg-slate-950/90 z-20 flex flex-col items-center justify-center backdrop-blur-sm">
                          <Trophy size={48} className="text-yellow-500 mb-4" />
                          <h3 className="text-xl font-black text-white uppercase">Match Concluded</h3>
                          <p className="text-slate-400 text-sm font-bold mb-6">Winner: {getTeam(match.winnerId!, tourney)?.name}</p>
                          <div className="flex items-center gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
                              <div className="text-right">
                                  <p className="text-[10px] font-black text-slate-500 uppercase">Player of the Match</p>
                                  <p className="text-lg font-black text-yellow-400">{getPlayer(match.pomId!, tourney)?.name}</p>
                              </div>
                              <Medal size={32} className="text-yellow-400" />
                          </div>
                      </div>
                  )}

                  {/* End Match Modal */}
                  {showEndMatchModal && (
                      <div className="absolute inset-0 bg-slate-950/95 z-30 flex flex-col items-center justify-center p-8">
                          <h3 className="text-2xl font-black text-white uppercase mb-6">Conclude Match</h3>
                          
                          <div className="w-full max-w-md space-y-4">
                              <div className="space-y-2">
                                  <label className="text-xs font-black text-slate-500 uppercase">Select Winner</label>
                                  <select 
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none"
                                    value={selectedWinnerId}
                                    onChange={(e) => setSelectedWinnerId(e.target.value)}
                                  >
                                      <option value="">Select Team...</option>
                                      <option value={match.teamAId}>{getTeam(match.teamAId, tourney)?.name}</option>
                                      <option value={match.teamBId}>{getTeam(match.teamBId, tourney)?.name}</option>
                                  </select>
                              </div>

                              <div className="space-y-2">
                                  <label className="text-xs font-black text-slate-500 uppercase">Player of the Match</label>
                                  <select 
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none"
                                    value={selectedPomId}
                                    onChange={(e) => setSelectedPomId(e.target.value)}
                                  >
                                      <option value="">Select Player...</option>
                                      {[...getTeam(match.teamAId, tourney)?.playerIds || [], ...getTeam(match.teamBId, tourney)?.playerIds || []].map(pid => (
                                          <option key={pid} value={pid}>{getPlayer(pid, tourney)?.name}</option>
                                      ))}
                                  </select>
                              </div>

                              <div className="flex gap-3 pt-4">
                                  <button onClick={() => setShowEndMatchModal(false)} className="flex-1 bg-slate-800 py-3 rounded-xl font-black text-slate-400 hover:bg-slate-700">Cancel</button>
                                  <button onClick={endMatch} className="flex-1 bg-green-600 py-3 rounded-xl font-black text-white hover:bg-green-500 shadow-lg shadow-green-600/20">Confirm End</button>
                              </div>
                          </div>
                      </div>
                  )}

                  {/* Score Display */}
                  <div className="flex items-center justify-between mb-8 px-4">
                     <div>
                        <h3 className="text-2xl font-black text-white">{battingTeam?.shortName}</h3>
                        <p className="text-5xl font-black text-white tracking-tighter">{match.scoreA}</p>
                     </div>
                     <div className="text-right">
                         <p className="text-xs font-bold text-slate-500 uppercase">OVERS</p>
                         <p className="text-3xl font-black text-white">{match.oversA}</p>
                     </div>
                  </div>

                  {match.target && (
                      <div className="mb-6 bg-slate-950 p-3 rounded-xl border border-slate-900 flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-400">Target: {match.target}</span>
                          <span className="text-xs font-black text-yellow-500">
                             Need {match.target - parseInt(match.scoreA.split('/')[0])} runs
                          </span>
                      </div>
                  )}

                  {/* Player Controls (Batters & Bowlers) */}
                  <div className="grid grid-cols-3 gap-4 mb-6 bg-slate-950 p-4 rounded-2xl border border-slate-900">
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-green-500 uppercase">Striker</label>
                            <select 
                                className="w-full bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold px-2 py-1.5"
                                value={match.currentBatters.strikerId || ""}
                                onChange={(e) => updateMatchPlayers(e.target.value, match.currentBatters.nonStrikerId!, match.currentBowlerId!)}
                                disabled={isLocked}
                            >
                                <option value="">Select Striker</option>
                                {battingTeam?.playerIds.map(pid => (
                                    <option key={pid} value={pid}>{getPlayer(pid, tourney)?.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-500 uppercase">Non-Striker</label>
                            <select 
                                className="w-full bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold px-2 py-1.5"
                                value={match.currentBatters.nonStrikerId || ""}
                                onChange={(e) => updateMatchPlayers(match.currentBatters.strikerId!, e.target.value, match.currentBowlerId!)}
                                disabled={isLocked}
                            >
                                <option value="">Select Non-Striker</option>
                                {battingTeam?.playerIds.map(pid => (
                                    <option key={pid} value={pid}>{getPlayer(pid, tourney)?.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-red-500 uppercase">Bowler</label>
                            <select 
                                className="w-full bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold px-2 py-1.5"
                                value={match.currentBowlerId || ""}
                                onChange={(e) => updateMatchPlayers(match.currentBatters.strikerId!, match.currentBatters.nonStrikerId!, e.target.value)}
                                disabled={isLocked}
                            >
                                <option value="">Select Bowler</option>
                                {bowlingTeam?.playerIds.map(pid => (
                                    <option key={pid} value={pid}>{getPlayer(pid, tourney)?.name}</option>
                                ))}
                            </select>
                        </div>
                  </div>

                  {/* Refined Input Console */}
                  <div className="bg-slate-900/50 p-6 rounded-[2rem] border border-slate-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left: Runs & Extras */}
                        <div className="space-y-4">
                             <div className="flex justify-between items-center">
                                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Outcome</h4>
                                 <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-900">
                                      {['Legal', 'Wide', 'NoBall'].map(dt => (
                                          <button 
                                             key={dt} 
                                             onClick={() => setDeliveryType(dt as any)} 
                                             disabled={isLocked}
                                             className={`px-3 py-1.5 rounded-md text-[9px] font-black uppercase transition-all ${deliveryType === dt ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                          >
                                             {dt}
                                          </button>
                                      ))}
                                 </div>
                             </div>
                             
                             <div className="grid grid-cols-4 gap-2">
                                 {[0, 1, 2, 3, 4, 6].map(r => (
                                     <button 
                                        key={r} 
                                        onClick={() => setSelectedRuns(r)} 
                                        disabled={isLocked}
                                        className={`h-12 rounded-xl font-black text-lg transition-all border ${selectedRuns === r ? 'bg-green-500 text-white border-green-400 shadow-lg shadow-green-500/20' : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-600'}`}
                                     >
                                        {r}
                                     </button>
                                 ))}
                                 <button 
                                    onClick={() => setIsWicket(!isWicket)} 
                                    disabled={isLocked}
                                    className={`col-span-2 h-12 rounded-xl font-black text-xs uppercase transition-all border flex items-center justify-center gap-2 ${isWicket ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/20' : 'bg-slate-950 text-red-500 border-slate-800 hover:border-red-900/50'}`}
                                 >
                                    <div className={`w-2 h-2 rounded-full ${isWicket ? 'bg-white' : 'bg-red-500'}`}></div>
                                    Wicket
                                 </button>
                             </div>
                        </div>

                        {/* Right: Context Details */}
                        <div className="space-y-4">
                             <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ball Context</h4>
                             
                             {/* Conditional Inputs */}
                             <div className="grid grid-cols-2 gap-3">
                                 <div className="space-y-1">
                                     <label className="text-[9px] font-bold text-slate-600 uppercase">Shot Zone</label>
                                     <select 
                                        value={shotZone} 
                                        onChange={(e) => setShotZone(e.target.value as any)} 
                                        disabled={isLocked || deliveryType !== 'Legal'} 
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                     >
                                         {['Cover', 'Long On', 'Long Off', 'Mid Wicket', 'Square Leg', 'Third Man', 'Fine Leg', 'Point', 'Slips'].map(z => <option key={z}>{z}</option>)}
                                     </select>
                                 </div>
                                 <div className="space-y-1">
                                     <label className="text-[9px] font-bold text-slate-600 uppercase">Shot Type</label>
                                     <select 
                                        value={shotType} 
                                        onChange={(e) => setShotType(e.target.value as any)} 
                                        disabled={isLocked || deliveryType !== 'Legal'} 
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                     >
                                         {['Drive', 'Pull', 'Cut', 'Loft', 'Defensive', 'Sweep', 'Scoop'].map(t => <option key={t}>{t}</option>)}
                                     </select>
                                 </div>
                                 <div className="space-y-1">
                                     <label className="text-[9px] font-bold text-slate-600 uppercase">Fielder</label>
                                     <select 
                                        value={fielderName} 
                                        onChange={(e) => setFielderName(e.target.value)} 
                                        disabled={isLocked} 
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-bold text-white"
                                     >
                                         <option value="">None</option>
                                         {bowlingTeam?.playerIds.map(pid => (
                                             <option key={pid} value={getPlayer(pid, tourney)?.name}>{getPlayer(pid, tourney)?.name}</option>
                                         ))}
                                     </select>
                                 </div>
                                 {isWicket && (
                                     <div className="space-y-1 animate-in fade-in zoom-in">
                                         <label className="text-[9px] font-bold text-red-500 uppercase">Dismissal</label>
                                         <select 
                                             value={wicketType} 
                                             onChange={(e) => setWicketType(e.target.value as any)} 
                                             disabled={isLocked} 
                                             className="w-full bg-red-950/20 border border-red-900/50 rounded-lg px-3 py-2 text-xs font-bold text-white"
                                         >
                                             {['Caught', 'Bowled', 'LBW', 'Run Out', 'Stumped'].map(w => <option key={w}>{w}</option>)}
                                         </select>
                                     </div>
                                 )}
                             </div>
                        </div>
                    </div>

                    {/* Big Submit Button */}
                    <button 
                        onClick={submitBall} 
                        disabled={isProcessingBall || isLocked} 
                        className="w-full mt-6 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-black text-sm uppercase tracking-widest text-white shadow-xl shadow-indigo-600/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 group"
                    >
                        {isProcessingBall ? (
                             <>
                               <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                               Processing AI Commentary...
                             </>
                        ) : (
                             <>
                               Update Scoreboard <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                             </>
                        )}
                    </button>
                  </div>

                  {/* Match Control Buttons */}
                  {!isLocked && (
                      <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-6 mt-6">
                          <button 
                            onClick={endInnings}
                            disabled={match.innings === 2}
                            className={`py-3 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 ${match.innings === 2 ? 'bg-slate-900 text-slate-600 cursor-not-allowed' : 'bg-orange-600/10 text-orange-500 hover:bg-orange-600 hover:text-white'}`}
                          >
                              <ArrowLeftRight size={14} /> End Innings
                          </button>
                          <button 
                            onClick={() => setShowEndMatchModal(true)}
                            className="py-3 bg-green-600/10 text-green-500 hover:bg-green-600 hover:text-white rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2"
                          >
                              <Flag size={14} /> End Match
                          </button>
                      </div>
                  )}
               </div>
           </div>

           {/* Right: AI Commentary Log */}
           <div className="lg:col-span-4 h-full">
               <div className="bg-[#020617] border border-slate-900 rounded-[2.5rem] p-6 h-[600px] flex flex-col">
                   <h3 className="font-black text-xs text-slate-500 uppercase tracking-widest mb-4">Live Feed</h3>
                   <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
                       {match.commentaryLog?.map((log, i) => (
                           <div key={i} className={`p-4 rounded-2xl border ${log.isWicket ? 'bg-red-950/20 border-red-900/50' : log.run >= 4 ? 'bg-green-950/20 border-green-900/50' : 'bg-slate-900 border-slate-800'}`}>
                               <div className="flex justify-between items-start mb-2">
                                   <div className="flex items-center gap-2">
                                       <span className="text-[10px] font-black bg-slate-950 px-2 py-1 rounded text-slate-400">{log.ball}</span>
                                       {log.batterName && <span className="text-[9px] text-indigo-400 font-bold uppercase">{log.batterName.split(' ')[0]}</span>}
                                   </div>
                                   <span className={`text-xs font-black ${log.isWicket ? 'text-red-500' : 'text-white'}`}>{log.isWicket ? 'WICKET' : `${log.run} Runs`}</span>
                               </div>
                               <p className="text-xs text-slate-300 font-medium leading-relaxed italic">"{log.text}"</p>
                           </div>
                       ))}
                       {!match.commentaryLog?.length && <div className="text-center text-slate-600 text-xs mt-10">Waiting for first ball...</div>}
                   </div>
               </div>
           </div>
        </div>
      </div>
    );
  };

  // --- Main Render Switch ---
  
  return (
    <div className="space-y-8 pb-20">
       {activeView === 'List' && (
           // Tournament List View (Existing)
           <div className="space-y-6 animate-in fade-in duration-500">
             <div className="bg-gradient-to-r from-indigo-900/40 to-slate-950 p-8 rounded-[3rem] border border-slate-900 relative overflow-hidden">
                <div className="relative z-10">
                   <h2 className="text-3xl font-black mb-6 uppercase italic tracking-tighter">Tournament Control</h2>
                   <div className="space-y-4 max-w-2xl">
                     <input value={newTourneyName} onChange={(e) => setNewTourneyName(e.target.value)} placeholder="Event Name (e.g. Asia Cup 2025)" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 font-bold text-white placeholder:text-slate-600" />
                     <button onClick={addTournament} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20"><Plus size={18} /> Create Event</button>
                   </div>
                </div>
                <Trophy className="absolute -bottom-10 -right-10 text-white/5 w-64 h-64 rotate-12" />
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tournaments.map(t => (
                  <div key={t.id} onClick={() => { setSelectedTournamentId(t.id); setActiveView('Profile'); setProfileType('Tournament'); }} className="group cursor-pointer glass-panel p-6 rounded-[2.5rem] hover:bg-slate-900 hover:border-indigo-500/50 transition-all">
                     <div className="flex justify-between items-start mb-6">
                        <div className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center text-indigo-400 border border-slate-800"><Trophy size={28} /></div>
                        <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-full border ${
                            t.status === 'Live' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                            t.status === 'Completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                            'bg-slate-900 text-slate-500 border-slate-800'
                        }`}>{t.status}</span>
                     </div>
                     <h3 className="text-2xl font-black mb-2 group-hover:text-indigo-400 transition-colors">{t.name}</h3>
                     <div className="flex items-center gap-2 text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-6">View Profile <ChevronRight size={12} /></div>
                  </div>
                ))}
             </div>
           </div>
       )}

       {activeView === 'Profile' && renderProfile()}

       {activeView === 'Details' && (
           // Detail Tabs (Fixtures, Teams, etc.) - Simplified for brevity
           <div className="space-y-6 animate-in slide-in-from-right">
               <div className="flex items-center justify-between">
                   <button onClick={() => setActiveView('Profile')} className="text-xs font-black text-slate-500 hover:text-white uppercase flex items-center gap-1"><ChevronRight className="rotate-180" size={14} /> Back to Profile</button>
               </div>
               <div className="flex bg-slate-950 p-1 rounded-xl w-fit border border-slate-900">
                   {['Fixtures', 'Teams'].map((t: any) => (
                       <button key={t} onClick={() => setDetailTab(t)} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase ${detailTab === t ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>{t}</button>
                   ))}
               </div>
               
               {detailTab === 'Teams' && (
                   <div className="space-y-6">
                       <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col gap-4">
                            <h4 className="text-sm font-black text-white uppercase tracking-widest">Quick Add Team</h4>
                            {tournaments.find(t => t.id === selectedTournamentId)?.status !== 'Completed' ? (
                                <div className="flex gap-4">
                                    <input placeholder="New Team Name" value={newTeamName} onChange={e => setNewTeamName(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-white w-full outline-none focus:border-indigo-500" />
                                    <select value={newTeamGroup} onChange={(e) => setNewTeamGroup(e.target.value as any)} className="bg-slate-950 border border-slate-800 rounded-xl px-4 text-xs font-bold text-white outline-none">
                                        <option value="A">Group A</option>
                                        <option value="B">Group B</option>
                                    </select>
                                    <button onClick={addTeam} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase whitespace-nowrap shadow-lg hover:bg-indigo-500">Add Team</button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase w-full justify-center py-4 bg-slate-950 rounded-xl border border-slate-800">
                                    <Lock size={14} /> Team Management Locked
                                </div>
                            )}
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                           {tournaments.find(t => t.id === selectedTournamentId)?.teams.map(team => (
                               <div key={team.id} onClick={() => { setActiveView('Profile'); setProfileType('Team'); setProfileDataId(team.id); }} className="glass-panel p-6 rounded-2xl cursor-pointer hover:bg-slate-900">
                                   <div className="flex justify-between items-start mb-4">
                                       <h3 className="font-black text-lg text-white">{team.name}</h3>
                                       <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded font-bold">{team.group}</span>
                                   </div>
                                   <p className="text-xs text-slate-500 font-bold mb-4">{team.playerIds.length} Players</p>
                                   
                                   {tournaments.find(t => t.id === selectedTournamentId)?.status !== 'Completed' && (
                                       <div className="pt-4 border-t border-slate-800">
                                           <div className="flex gap-2">
                                               <input onClick={e => e.stopPropagation()} placeholder="Add Player..." value={newPlayerName} onChange={e => setNewPlayerName(e.target.value)} className="bg-slate-950 border-none rounded-lg px-2 py-1 text-[10px] text-white w-full" />
                                               <button onClick={(e) => { e.stopPropagation(); registerPlayer(team.id); }} className="bg-slate-800 text-white px-3 rounded-lg text-[10px] font-black">+</button>
                                           </div>
                                       </div>
                                   )}
                               </div>
                           ))}
                       </div>
                   </div>
               )}

               {detailTab === 'Fixtures' && (
                   <div className="space-y-6">
                        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex gap-4">
                            {/* Fixture Form Inputs (Simplified) */}
                            <button onClick={e => {
                                const t = tournaments.find(x => x.id === selectedTournamentId);
                                if(t && t.teams.length >= 2) {
                                    // Trigger add internally for demo
                                    const newMatch: Match = { 
                                        id: `m${Date.now()}`, 
                                        round: 'League', 
                                        teamAId: t.teams[0].id, 
                                        teamBId: t.teams[1].id,
                                        battingTeamId: t.teams[0].id,
                                        bowlingTeamId: t.teams[1].id, 
                                        winnerId: null, 
                                        pomId: null,
                                        status: 'Scheduled', 
                                        scoreA: '0/0', oversA: '0.0', 
                                        scoreB: '0/0', oversB: '0.0', 
                                        innings: 1,
                                        currentBatters: { strikerId: null, nonStrikerId: null }, 
                                        currentBowlerId: null,
                                        playerStats: {}
                                    };
                                    setTournaments(prev => prev.map(x => x.id === selectedTournamentId ? { ...x, matches: [...x.matches, newMatch] } : x));
                                }
                            }} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase">Auto-Generate Demo Fixture</button>
                        </div>
                        <div className="space-y-3">
                            {tournaments.find(t => t.id === selectedTournamentId)?.matches.map(m => (
                                <div key={m.id} onClick={() => { setSelectedMatchId(m.id); setActiveView('MatchDetails'); }} className="glass-panel p-4 rounded-2xl flex justify-between items-center cursor-pointer hover:border-slate-600 transition-colors">
                                    <div className="text-sm font-bold text-white">Match #{m.id.slice(-3)} <span className="text-slate-500 font-normal">| {m.status}</span></div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setSelectedMatchId(m.id); setActiveView('Scorer'); }} 
                                            disabled={tournaments.find(t => t.id === selectedTournamentId)?.status === 'Upcoming'}
                                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase z-10 ${tournaments.find(t => t.id === selectedTournamentId)?.status === 'Upcoming' ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-500'}`}
                                        >
                                            Launch Scorer
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                   </div>
               )}
           </div>
       )}
       
       {activeView === 'MatchDetails' && renderMatchDetails()}
       {activeView === 'Scorer' && renderScorer()}
    </div>
  );
};

export default TournamentManager;
