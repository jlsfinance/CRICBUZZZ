
export enum MatchFormat {
  T20 = 'T20',
  ODI = 'ODI',
  TEST = 'TEST'
}

export enum PlayerRole {
  BATSMAN = 'Batsman',
  BOWLER = 'Bowler',
  ALL_ROUNDER = 'All-Rounder',
  WK = 'Wicket-Keeper'
}

export interface Player {
  id: string;
  name: string;
  role: PlayerRole;
  basePrice: number;
  currentBid: number;
  stats: {
    matches: number;
    runs: number;
    wickets: number;
    avg: number;
    strikeRate: number;
  };
  teamId?: string;
  isOverseas: boolean;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  purseRemaining: number;
  squadSize: number;
  maxOverseas: number;
}

export interface Match {
  id: string;
  teamA: string;
  teamB: string;
  format: MatchFormat;
  status: 'LIVE' | 'UPCOMING' | 'COMPLETED';
  score: string;
  lastBall: string;
  winProbability: number; // Percentage for Team A
}

export interface DiscussionThread {
  id: string;
  author: string;
  title: string;
  content: string;
  upvotes: number;
  commentsCount: number;
  timestamp: string;
}
