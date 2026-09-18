import React from 'react';
import { Play, BookOpen, ShieldCheck, Sparkles } from 'lucide-react';
import { ChessPiece } from './ChessPiece';

export const Hero: React.FC = () => {
  return (
    <section id="hero" className="relative pt-12 pb-20 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-amber-500/10 via-emerald-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wide shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Aql, Sabr va Taktika Maydoni</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
              Shaxmat Olamiga <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-emerald-400">
                Xush Kelibsiz!
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Klassik donalar strategiyasini o'rganing, interaktiv bot bilan onlayn shaxmat bahslarida kuch sinashing hamda O'zbekiston va dunyo shaxmat yulduzlarining g'alaba sirlarini kashf eting.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#game-section"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-base shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all transform hover:-translate-y-0.5"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Hozir o'ynash</span>
              </a>

              <a
                href="#rules-section"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-semibold text-base border border-slate-700 hover:border-slate-600 transition"
              >
                <BookOpen className="w-5 h-5 text-amber-400" />
                <span>Qoidalar & Maslahatlar</span>
              </a>
            </div>

            {/* Quick trust / feature stats */}
            <div className="pt-8 border-t border-slate-800/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">64</div>
                <div className="text-xs text-slate-400 mt-0.5">Sirlar Katagi</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">3 Daraja</div>
                <div className="text-xs text-slate-400 mt-0.5">Sun'iy Intellekt</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-sky-400 font-mono">100%</div>
                <div className="text-xs text-slate-400 mt-0.5">Bepul va Ochiq</div>
              </div>
            </div>
          </div>

          {/* Right Hero Graphic: Visual Chessboard & Royal Pieces */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative w-full max-w-[380px] sm:max-w-[420px] aspect-square">
              {/* Glowing back aura */}
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-emerald-500/20 to-transparent rounded-3xl blur-2xl transform rotate-6" />

              {/* Tilted decorative board frame */}
              <div className="relative w-full h-full rounded-3xl bg-slate-900/90 border border-slate-700/80 p-5 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
                {/* Top mini header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    ChessMaster Engine
                  </span>
                </div>

                {/* 4x4 Artistic mini showcase grid */}
                <div className="grid grid-cols-4 gap-2 my-auto p-3 bg-slate-950/70 rounded-2xl border border-slate-800/80">
                  <div className="aspect-square bg-[#eeeed2] rounded-lg p-1.5 flex items-center justify-center shadow">
                    <ChessPiece type="k" color="w" />
                  </div>
                  <div className="aspect-square bg-[#769656] rounded-lg p-1.5 flex items-center justify-center shadow">
                    <ChessPiece type="q" color="b" />
                  </div>
                  <div className="aspect-square bg-[#eeeed2] rounded-lg p-1.5 flex items-center justify-center shadow">
                    <ChessPiece type="n" color="w" />
                  </div>
                  <div className="aspect-square bg-[#769656] rounded-lg p-1.5 flex items-center justify-center shadow">
                    <ChessPiece type="r" color="b" />
                  </div>

                  <div className="aspect-square bg-[#769656] rounded-lg p-1.5 flex items-center justify-center shadow">
                    <ChessPiece type="p" color="b" />
                  </div>
                  <div className="aspect-square bg-[#eeeed2] rounded-lg p-1.5 flex items-center justify-center shadow">
                    <ChessPiece type="b" color="w" />
                  </div>
                  <div className="aspect-square bg-[#769656] rounded-lg p-1.5 flex items-center justify-center shadow">
                    <ChessPiece type="k" color="b" />
                  </div>
                  <div className="aspect-square bg-[#eeeed2] rounded-lg p-1.5 flex items-center justify-center shadow">
                    <ChessPiece type="p" color="w" />
                  </div>
                </div>

                {/* Bottom quote badge */}
                <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                  <span className="italic text-slate-300 font-medium">"Har bir dona — yangi imkoniyat."</span>
                  <span className="text-amber-400 font-mono font-bold">1. e4!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
