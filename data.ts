
import { Team, Player, Match, MatchFormat, PlayerRole, DiscussionThread } from './types';

export const TEAMS: Team[] = [
  { id: 't1', name: 'Mumbai Indians', shortName: 'MI', logo: 'https://picsum.photos/seed/mi/100/100', purseRemaining: 15.5, squadSize: 22, maxOverseas: 8 },
  { id: 't2', name: 'Chennai Super Kings', shortName: 'CSK', logo: 'https://picsum.photos/seed/csk/100/100', purseRemaining: 12.0, squadSize: 24, maxOverseas: 8 },
  { id: 't3', name: 'Royal Challengers Bangalore', shortName: 'RCB', logo: 'https://picsum.photos/seed/rcb/100/100', purseRemaining: 8.2, squadSize: 21, maxOverseas: 8 },
];

export const PLAYERS: Player[] = [
  { id: 'p1', name: 'Virat Kohli', role: PlayerRole.BATSMAN, basePrice: 2.0, currentBid: 0, isOverseas: false, stats: { matches: 250, runs: 12000, wickets: 4, avg: 52.4, strikeRate: 138.5 } },
  { id: 'p2', name: 'Jasprit Bumrah', role: PlayerRole.BOWLER, basePrice: 1.5, currentBid: 0, isOverseas: false, stats: { matches: 120, runs: 150, wickets: 145, avg: 22.1, strikeRate: 150.2 } },
  { id: 'p3', name: 'Glenn Maxwell', role: PlayerRole.ALL_ROUNDER, basePrice: 1.0, currentBid: 0, isOverseas: true, stats: { matches: 180, runs: 4500, wickets: 60, avg: 31.2, strikeRate: 162.0 } },
];

export const MATCHES: Match[] = [
  { id: 'm1', teamA: 'MI', teamB: 'CSK', format: MatchFormat.T20, status: 'LIVE', score: '145/4 (17.2 ov)', lastBall: '4 runs by Surya', winProbability: 62 },
  { id: 'm3', teamA: 'AUS', teamB: 'ENG', format: MatchFormat.ODI, status: 'LIVE', score: '287/8 (48.1 ov)', lastBall: 'Wicket! Starc b Archer', winProbability: 45 },
  { id: 'm2', teamA: 'RCB', teamB: 'SRH', format: MatchFormat.T20, status: 'UPCOMING', score: 'Starts at 19:30 IST', lastBall: '', winProbability: 50 },
  { id: 'm4', teamA: 'RSA', teamB: 'NZ', format: MatchFormat.TEST, status: 'COMPLETED', score: 'RSA won by 4 wickets', lastBall: '', winProbability: 100 },
];

export const THREADS: DiscussionThread[] = [
  { id: 'th1', author: 'CricFan99', title: 'Why Kohli needs to open in the next match', content: 'Given the pitch conditions at Wankhede, we need an explosive start...', upvotes: 452, commentsCount: 89, timestamp: '2h ago' },
  { id: 'th2', author: 'DataNerd', title: 'Win Probability Analysis for MI vs CSK', content: 'Statistical model suggests a 62% edge for the home team due to dew factor...', upvotes: 210, commentsCount: 34, timestamp: '5h ago' },
];
