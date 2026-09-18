import React, { useState } from 'react';
import { Target, Zap, Shield, BookOpen, Flame, Award, CheckCircle2, ChevronRight, Compass } from 'lucide-react';
import { STRATEGY_GUIDES } from '../data/chessData';

export const RulesSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedGuideId, setSelectedGuideId] = useState<string | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Target':
        return <Target className="w-5 h-5 text-emerald-400" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'Shield':
        return <Shield className="w-5 h-5 text-sky-400" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-indigo-400" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-rose-400" />;
      case 'Award':
        return <Award className="w-5 h-5 text-yellow-400" />;
      default:
        return <Compass className="w-5 h-5 text-emerald-400" />;
    }
  };

  const filteredGuides = activeCategory === 'all'
    ? STRATEGY_GUIDES
    : STRATEGY_GUIDES.filter((g) => g.category === activeCategory);

  return (
    <section id="rules-section" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Bilim va Strategiya</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Shaxmat Qoidalari va <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-emerald-400">G'alaba Taktikalari</span>
        </h2>
        <p className="mt-2 text-slate-400 text-sm sm:text-base">
          Shaxmatda g'alaba tasodif emas, balki to'g'ri strategiya natijasidir. Boshlang'ich va o'rta darajadagi o'yinchilar uchun muhim qoidalar va mashhur debyutlar.
        </p>

        {/* Categories Tab Filter */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          {[
            { id: 'all', name: 'Barchasi' },
            { id: 'strategy', name: 'Asosiy qoidalar' },
            { id: 'opening', name: 'Debyutlar' },
            { id: 'tactics', name: 'Taktika & Xavfsizlik' },
            { id: 'endgame', name: 'Endshpil' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === cat.id
                  ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Guide Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGuides.map((guide) => {
          const isSelected = selectedGuideId === guide.id;
          return (
            <div
              key={guide.id}
              className={`rounded-2xl p-6 bg-slate-900/80 border transition-all flex flex-col justify-between hover:border-amber-500/40 hover:shadow-xl group backdrop-blur-sm ${
                isSelected ? 'border-amber-400/80 ring-1 ring-amber-400/30 bg-slate-850' : 'border-slate-800'
              }`}
            >
              <div>
                {/* Header tag */}
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 group-hover:scale-110 transition-transform">
                    {getIcon(guide.iconName)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {guide.categoryName}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        guide.level === "Boshlang'ich"
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : guide.level === "O'rta"
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {guide.level}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                  {guide.title}
                </h3>

                {/* Moves if opening */}
                {guide.moves && (
                  <div className="mb-3 px-3 py-1.5 rounded-lg bg-slate-950 font-mono text-xs text-amber-400 font-semibold border border-slate-800 flex items-center justify-between">
                    <span>Yurishlar:</span>
                    <span>{guide.moves}</span>
                  </div>
                )}

                {/* Description */}
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  {guide.description}
                </p>

                {/* Key Points */}
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
                    Asosiy maslahatlar:
                  </span>
                  {guide.keyPoints.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom interactive action */}
              <div className="mt-6 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <a
                  href="#game-section"
                  className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold transition"
                >
                  <span>Taxtada sinab ko'rish</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => setSelectedGuideId(isSelected ? null : guide.id)}
                  className="text-slate-400 hover:text-white"
                >
                  {isSelected ? 'Qisqartirish' : 'Batafsil'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
