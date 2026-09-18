export type BotDifficulty = 'easy' | 'medium' | 'hard';

export type GameMode = 'ranked' | 'casual' | 'online';

export type PlayerColor = 'w' | 'b';

export type MoveQuality = 'best' | 'good' | 'inaccuracy' | 'mistake' | 'blunder';

export type BoardTheme = 'emerald' | 'wood' | 'slate' | 'sand';

export type TimeControlType = 'bullet' | 'blitz' | 'rapid' | 'classical';

export interface TimeControlOption {
  id: string;
  name: string;
  type: TimeControlType;
  initialSeconds: number; // 0 for unlimited
  incrementSeconds: number;
  badge: string;
  description: string;
}

export interface CelebrityBot {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  flag: string;
  elo: number;
  title: string;
  avatarUrl: string;
  style: string;
  styleUz: string;
  bio: string;
  greeting: string;
  winQuote: string;
  lossQuote: string;
  captureQuote: string;
  checkQuote: string;
  openingPreference: string[];
}

export interface OpeningInfo {
  eco: string;
  name: string;
  nameUz: string;
  moves: string[];
  description: string;
}

export interface PlayerGameAnalysis {
  opening: OpeningInfo | null;
  openingAccuracy: number; // 0 - 100%
  overallAccuracy: number; // 0 - 100%
  estimatedElo: number; // strictly between 300 and 3200
  moveBreakdown: {
    best: number;
    good: number;
    inaccuracy: number;
    mistake: number;
    blunder: number;
  };
  averageCentipawnLoss: number;
}

export interface UserEloMatch {
  id: string;
  date: string;
  opponentElo: number;
  opponentName?: string;
  result: 'win' | 'loss' | 'draw';
  eloChange: number;
  newElo: number;
  accuracy: number;
  openingName: string;
  timeControl?: string;
}

export interface UserEloProfile {
  currentElo: number;
  highestElo: number;
  lowestElo: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  history: UserEloMatch[];
}

export interface EloTier {
  elo: number;
  title: string;
  titleUz: string;
  badgeColor: string;
  badgeBg: string;
  description: string;
  depth: number;
}

export interface MoveHistoryItem {
  san: string;
  from: string;
  to: string;
  piece: string;
  color: 'w' | 'b';
  captured?: string;
  promotion?: string;
}

export interface CapturedPieces {
  w: string[];
  b: string[];
}

export interface Grandmaster {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  birthYear: number;
  peakRating: number;
  title: string;
  photoUrl: string;
  bio: string;
  achievements: string[];
  quote: string;
}

export interface StrategyGuide {
  id: string;
  title: string;
  category: 'opening' | 'tactics' | 'endgame' | 'strategy';
  categoryName: string;
  level: 'Boshlang\'ich' | 'O\'rta' | 'Ilg\'or';
  description: string;
  moves?: string;
  keyPoints: string[];
  iconName: string;
}

export interface WorldTopPlayer {
  rank: number;
  name: string;
  country: string;
  countryCode: string;
  flag: string;
  rating: number;
  rapidRating?: number;
  blitzRating?: number;
  title: string;
  birthYear: number;
  change: number; // e.g. +1, 0, -2
  isCelebrityBotAvailable?: boolean;
  botId?: string;
}

export interface OnlinePlayerInfo {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  flag: string;
  elo: number;
  avatarUrl: string;
  pingMs: number;
}
