import React from 'react';
import { PlayerGameAnalysis } from '../types';
import { BookOpen, Sparkles, Activity, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

interface EloAnalysisPanelProps {
  analysis: PlayerGameAnalysis;
  moveCount: number;
}

export const EloAnalysisPanel: React.FC<EloAnalysisPanelProps> = ({ analysis, moveCount }) => {
  const { opening, openingAccuracy, overallAccuracy, estimatedElo, moveBreakdown } = analysis;

  // Determine ELO status tier label
  const getEloLabel = (elo: number) => {
    if (elo >= 2800) return 'Grossmeyster darajasi';
    if (elo >= 2400) return 'Xalqaro Usta darajasi';
    if (elo >= 2000) return 'Usta nomzodi (CM)';
    if (elo >= 1600) return 'Klub o\'yinchisi';
    if (elo >= 1200) return 'O\'rta daraja';
    if (elo >= 800) return 'Havaskor';
    return 'Boshlang\'ich';
  };

  return (
    <div className="bg-slate-900/85 rounded-2xl p-4 border border-slate-800 shadow-xl backdrop-blur-sm space-y-3.5">
      {/* Dynamic Player Rating Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              O'yinchi Darajasi (Live ELO)
            </h4>
            <p className="text-[11px] text-slate-400">{getEloLabel(estimatedElo)}</p>
          </div>
        </div>

        <div className="text-right">
          <div className="inline-flex items-baseline gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-500/30">
            <span className="text-base font-black text-amber-300 font-mono">{estimatedElo}</span>
            <span className="text-[10px] text-slate-400 font-bold">ELO</span>
          </div>
        </div>
      </div>

      {/* Accuracy & Theory Progress Bars */}
      <div className="grid grid-cols-2 gap-3">
        {/* Overall Accuracy */}
        <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-medium">O'yin Aniqligi:</span>
            <span className="font-bold font-mono text-emerald-400">{overallAccuracy}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
              style={{ width: `${Math.max(5, overallAccuracy)}%` }}
            />
          </div>
        </div>

        {/* Opening Knowledge */}
        <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-medium">Debyut Nazariyasi:</span>
            <span className="font-bold font-mono text-cyan-400">{openingAccuracy}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full transition-all duration-300"
              style={{ width: `${Math.max(5, openingAccuracy)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Opening Detection Card */}
      <div className="bg-slate-950/70 rounded-xl p-3 border border-slate-800">
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-bold text-white truncate">
                {opening ? opening.nameUz : "Nazariyadan tashqari debyut"}
              </span>
              {opening && (
                <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/80 text-[10px] font-mono font-bold">
                  {opening.eco}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
              {opening ? opening.description : "O'yin erkin sxema bo'yicha rivojlanmoqda. Markaziy kataklarni nazorat qilishga e'tibor bering."}
            </p>
          </div>
        </div>
      </div>

      {/* Move Quality Breakdown Chips */}
      {moveCount > 0 && (
        <div className="pt-1">
          <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center justify-between">
            <span>Yurishlar Sifati (Siz):</span>
            <span className="text-[10px] text-slate-500">{moveCount} ta yurish</span>
          </div>
          <div className="grid grid-cols-5 gap-1 text-center font-mono">
            <div className="bg-slate-950/60 rounded-lg p-1.5 border border-emerald-500/20">
              <div className="text-emerald-400 font-bold text-xs">{moveBreakdown.best}</div>
              <div className="text-[9px] text-slate-400">Zo'r</div>
            </div>
            <div className="bg-slate-950/60 rounded-lg p-1.5 border border-cyan-500/20">
              <div className="text-cyan-400 font-bold text-xs">{moveBreakdown.good}</div>
              <div className="text-[9px] text-slate-400">Yaxshi</div>
            </div>
            <div className="bg-slate-950/60 rounded-lg p-1.5 border border-yellow-500/20">
              <div className="text-yellow-400 font-bold text-xs">{moveBreakdown.inaccuracy}</div>
              <div className="text-[9px] text-slate-400">Noaniq</div>
            </div>
            <div className="bg-slate-950/60 rounded-lg p-1.5 border border-orange-500/20">
              <div className="text-orange-400 font-bold text-xs">{moveBreakdown.mistake}</div>
              <div className="text-[9px] text-slate-400">Xato</div>
            </div>
            <div className="bg-slate-950/60 rounded-lg p-1.5 border border-rose-500/20">
              <div className="text-rose-400 font-bold text-xs">{moveBreakdown.blunder}</div>
              <div className="text-[9px] text-slate-400">Qo'pol</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
