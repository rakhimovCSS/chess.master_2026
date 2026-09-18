import React from 'react';
import { Trophy, Award, Quote, Sparkles, Swords } from 'lucide-react';
import { GRANDMASTERS } from '../data/chessData';

interface GrandmastersSectionProps {
  onChallengeBot?: (botId: string) => void;
}

export const GrandmastersSection: React.FC<GrandmastersSectionProps> = ({ onChallengeBot }) => {
  return (
    <section id="grandmasters-section" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
      {/* Section Heading */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Trophy className="w-3.5 h-3.5" />
          <span>Shaxmat Afsonalari</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Mashhur <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-emerald-400">Grossmeysterlar</span> Galereyasi
        </h2>
        <p className="mt-2 text-slate-400 text-sm sm:text-base">
          Shaxmat tarixida o'chmas iz qoldirgan jahon chempionlari va O'zbekiston shon-sharafini dunyo arenalarida yuksaltirgan buyuk shaxmat daholari.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {GRANDMASTERS.map((gm) => (
          <div
            key={gm.id}
            className="rounded-3xl bg-slate-900/85 border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-amber-500/40 hover:shadow-2xl transition-all duration-300 group backdrop-blur-sm"
          >
            <div>
              {/* Photo & Badge Container */}
              <div className="relative h-64 overflow-hidden bg-slate-950">
                <img
                  src={gm.photoUrl}
                  alt={gm.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter grayscale contrast-125 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Country / Title Tag */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-700 text-xs font-semibold text-amber-400">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>{gm.title}</span>
                </div>

                {/* ELO Rating Badge */}
                <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-emerald-500/90 text-slate-950 text-xs font-extrabold font-mono shadow">
                  {gm.peakRating} ELO
                </div>

                {/* Bottom name overlay */}
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-xl font-black text-white group-hover:text-amber-300 transition-colors">
                    {gm.name}
                  </h3>
                  <p className="text-xs text-slate-300 font-medium flex items-center gap-1">
                    <span>{gm.country}</span>
                    <span className="text-slate-500">•</span>
                    <span>Tug'ilgan yili: {gm.birthYear}</span>
                  </p>
                </div>
              </div>

              {/* Bio & Details */}
              <div className="p-5 space-y-4">
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed line-clamp-4 group-hover:line-clamp-none transition-all">
                  {gm.bio}
                </p>

                {/* Achievements List */}
                <div className="space-y-1.5 pt-3 border-t border-slate-800">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                    Asosiy yutuqlari:
                  </span>
                  {gm.achievements.map((ach, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                      <Award className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                      <span className="text-[11px] leading-snug">{ach}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quote & Play Action */}
            <div className="p-4 bg-slate-950/70 border-t border-slate-800/80 space-y-3">
              <div className="flex items-start gap-2 text-[11px] text-slate-400 italic">
                <Quote className="w-3.5 h-3.5 text-amber-400/80 shrink-0 mt-0.5" />
                <p className="line-clamp-2">"{gm.quote}"</p>
              </div>

              {onChallengeBot && (
                <button
                  onClick={() => onChallengeBot(gm.id)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white text-xs font-bold transition flex items-center justify-center gap-2 border border-slate-700/80 hover:border-emerald-500 shadow"
                >
                  <Swords className="w-3.5 h-3.5 text-amber-400" />
                  <span>Boti bilan bellashuv</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
