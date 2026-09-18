import React from 'react';
import { Timer, Zap } from 'lucide-react';

interface ChessClockProps {
  whiteTime: number; // in seconds
  blackTime: number;
  activeColor: 'w' | 'b';
  isUnlimited: boolean;
  whiteName: string;
  blackName: string;
  whiteElo?: number;
  blackElo?: number;
  whiteAvatar?: string;
  blackAvatar?: string;
  whiteFlag?: string;
  blackFlag?: string;
  isGameOver: boolean;
}

export const ChessClock: React.FC<ChessClockProps> = ({
  whiteTime,
  blackTime,
  activeColor,
  isUnlimited,
  whiteName,
  blackName,
  whiteElo,
  blackElo,
  whiteAvatar,
  blackAvatar,
  whiteFlag,
  blackFlag,
  isGameOver
}) => {
  const formatTime = (totalSeconds: number) => {
    if (isUnlimited) return '∞';
    const clamped = Math.max(0, totalSeconds);
    const mins = Math.floor(clamped / 60);
    const secs = Math.floor(clamped % 60);

    if (clamped < 10 && clamped > 0) {
      const tenths = Math.floor((clamped % 1) * 10);
      return `${secs}.${tenths}s`;
    }

    const minStr = mins < 10 ? `0${mins}` : `${mins}`;
    const secStr = secs < 10 ? `0${secs}` : `${secs}`;
    return `${minStr}:${secStr}`;
  };

  const isWhiteLow = !isUnlimited && whiteTime < 30 && whiteTime > 0;
  const isBlackLow = !isUnlimited && blackTime < 30 && blackTime > 0;

  return (
    <div className="w-full flex items-center justify-between gap-3 px-3 py-2 bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700/60 shadow-lg">
      {/* Black Player Card & Clock */}
      <div
        className={`flex items-center gap-3 px-3 py-1.5 rounded-xl transition-all duration-200 ${
          activeColor === 'b' && !isGameOver
            ? 'bg-emerald-950/40 ring-2 ring-emerald-500/50 shadow-md'
            : 'bg-slate-900/60'
        }`}
      >
        <div className="relative">
          {blackAvatar ? (
            <img
              src={blackAvatar}
              alt={blackName}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover border border-slate-600 shadow-sm"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-white">
              B
            </div>
          )}
          {blackFlag && (
            <span className="absolute -bottom-1 -right-1 text-xs">{blackFlag}</span>
          )}
        </div>
        <div className="flex flex-col text-left">
          <span className="text-xs font-semibold text-slate-200 truncate max-w-[90px] sm:max-w-[120px]">
            {blackName}
          </span>
          {blackElo && (
            <span className="text-[10px] text-amber-400/90 font-mono font-medium">
              {blackElo} ELO
            </span>
          )}
        </div>

        {/* Clock digits */}
        <div
          className={`ml-1 font-mono font-bold text-sm sm:text-base px-2.5 py-1 rounded-lg border transition-all ${
            isBlackLow
              ? 'bg-red-950/70 border-red-500 text-red-400 animate-pulse'
              : activeColor === 'b' && !isGameOver
              ? 'bg-emerald-900/50 border-emerald-500/70 text-emerald-300'
              : 'bg-slate-950/70 border-slate-700 text-slate-300'
          }`}
        >
          {formatTime(blackTime)}
        </div>
      </div>

      {/* Center Divider / Clock indicator */}
      <div className="flex items-center justify-center text-slate-400">
        <Timer className={`w-4 h-4 ${!isGameOver && !isUnlimited ? 'animate-spin text-emerald-400' : 'text-slate-500'}`} style={{ animationDuration: '6s' }} />
      </div>

      {/* White Player Card & Clock */}
      <div
        className={`flex items-center gap-3 px-3 py-1.5 rounded-xl transition-all duration-200 ${
          activeColor === 'w' && !isGameOver
            ? 'bg-emerald-950/40 ring-2 ring-emerald-500/50 shadow-md'
            : 'bg-slate-900/60'
        }`}
      >
        {/* Clock digits */}
        <div
          className={`font-mono font-bold text-sm sm:text-base px-2.5 py-1 rounded-lg border transition-all ${
            isWhiteLow
              ? 'bg-red-950/70 border-red-500 text-red-400 animate-pulse'
              : activeColor === 'w' && !isGameOver
              ? 'bg-emerald-900/50 border-emerald-500/70 text-emerald-300'
              : 'bg-slate-950/70 border-slate-700 text-slate-300'
          }`}
        >
          {formatTime(whiteTime)}
        </div>

        <div className="flex flex-col text-right">
          <span className="text-xs font-semibold text-slate-200 truncate max-w-[90px] sm:max-w-[120px]">
            {whiteName}
          </span>
          {whiteElo && (
            <span className="text-[10px] text-amber-400/90 font-mono font-medium">
              {whiteElo} ELO
            </span>
          )}
        </div>

        <div className="relative">
          {whiteAvatar ? (
            <img
              src={whiteAvatar}
              alt={whiteName}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover border border-slate-600 shadow-sm"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-900 flex items-center justify-center font-bold text-xs">
              W
            </div>
          )}
          {whiteFlag && (
            <span className="absolute -bottom-1 -right-1 text-xs">{whiteFlag}</span>
          )}
        </div>
      </div>
    </div>
  );
};
