import React from 'react';
import { Trophy, TrendingUp, TrendingDown, Minus, Award, RefreshCw, Eye, BookOpen, Activity } from 'lucide-react';
import { GameMode, PlayerGameAnalysis } from '../types';

interface EloGameOverModalProps {
  gameResult: {
    title: string;
    description: string;
    winner: 'w' | 'b' | 'draw' | null;
  };
  gameMode: GameMode;
  oldElo: number;
  newElo: number;
  eloChange: number;
  botElo: number;
  analysis: PlayerGameAnalysis;
  onRestart: () => void;
  onClose: () => void;
}

export const EloGameOverModal: React.FC<EloGameOverModalProps> = ({
  gameResult,
  gameMode,
  oldElo,
  newElo,
  eloChange,
  botElo,
  analysis,
  onRestart,
  onClose,
}) => {
  const isWinner = gameResult.winner === 'w';
  const isDraw = gameResult.winner === 'draw';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-700/80 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden my-6">
        {/* Top Glow Stripe */}
        <div
          className={`absolute top-0 left-0 right-0 h-1.5 ${
            isWinner
              ? 'bg-gradient-to-r from-emerald-400 via-amber-300 to-emerald-400'
              : isDraw
              ? 'bg-gradient-to-r from-slate-400 via-amber-400 to-slate-400'
              : 'bg-gradient-to-r from-rose-500 via-orange-400 to-rose-500'
          }`}
        />

        {/* Icon & Mode Tag */}
        <div className="text-center mb-4">
          <div
            className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-inner border ${
              isWinner
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                : isDraw
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                : 'bg-rose-500/15 border-rose-500/40 text-rose-400'
            }`}
          >
            {isWinner ? (
              <Trophy className="w-8 h-8" />
            ) : isDraw ? (
              <Award className="w-8 h-8" />
            ) : (
              <Activity className="w-8 h-8" />
            )}
          </div>

          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border ${
              gameMode === 'ranked'
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            {gameMode === 'ranked' ? '🏆 Rasmiy Darajali O\'yin' : '🎓 Erkin Mashg\'ulot O\'yini'}
          </span>

          <h3 className="text-2xl font-black text-white">{gameResult.title}</h3>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-sm mx-auto">{gameResult.description}</p>
        </div>

        {/* ELO Rating Update Box (Only for Ranked Mode) */}
        {gameMode === 'ranked' && (
          <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 mb-4 shadow-inner">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block mb-0.5">Sizning ELO reytingingiz:</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-slate-400 font-mono line-through opacity-70">
                    {oldElo}
                  </span>
                  <span className="text-2xl font-black text-white font-mono">➔ {newElo}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block mb-0.5">O'zgarish:</span>
                <div
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-sm font-black font-mono border ${
                    eloChange > 0
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : eloChange < 0
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {eloChange > 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : eloChange < 0 ? (
                    <TrendingDown className="w-4 h-4" />
                  ) : (
                    <Minus className="w-4 h-4" />
                  )}
                  <span>{eloChange > 0 ? `+${eloChange}` : eloChange}</span>
                </div>
              </div>
            </div>

            <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Raqib Bot ELO: <strong className="text-slate-200">{botElo}</strong></span>
              <span>Chegara: <strong className="text-amber-300">300 – 3200 ELO</strong></span>
            </div>
          </div>
        )}

        {/* Match Performance Metrics */}
        <div className="grid grid-cols-2 gap-2.5 mb-5 text-xs">
          <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800">
            <span className="text-slate-400 block mb-1">O'yindagi taxminiy ELO:</span>
            <div className="text-lg font-black text-amber-400 font-mono">
              {analysis.estimatedElo} <span className="text-xs font-normal text-slate-500">ELO</span>
            </div>
            <span className="text-[10px] text-slate-500">Yurishlar sifatidan kelib chiqib</span>
          </div>

          <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800">
            <span className="text-slate-400 block mb-1">Harakatlar aniqligi:</span>
            <div className="text-lg font-black text-emerald-400 font-mono">
              {analysis.overallAccuracy}%
            </div>
            <span className="text-[10px] text-slate-500">Debyut bilimi: {analysis.openingAccuracy}%</span>
          </div>
        </div>

        {/* Opening Tag */}
        {analysis.opening && (
          <div className="mb-5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-2 text-xs">
            <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="truncate">
              <span className="text-slate-400">Debyut: </span>
              <strong className="text-white">{analysis.opening.nameUz}</strong>{' '}
              <span className="text-emerald-400 font-mono text-[11px]">({analysis.opening.eco})</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            id="btn-modal-restart"
            onClick={onRestart}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-sm transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Yangi O'yin Boshlash</span>
          </button>
          <button
            id="btn-modal-close"
            onClick={onClose}
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition border border-slate-700 flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            <span>Taxtani Ko'rish</span>
          </button>
        </div>
      </div>
    </div>
  );
};
