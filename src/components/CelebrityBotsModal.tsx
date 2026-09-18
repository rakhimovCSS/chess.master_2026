import React from 'react';
import { CelebrityBot } from '../types';
import { CELEBRITY_BOTS } from '../data/celebrityBots';
import { X, Trophy, Swords, Zap, Crown, Flame, Shield, Award } from 'lucide-react';

interface CelebrityBotsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBot: (bot: CelebrityBot) => void;
  currentSelectedBotId?: string;
}

export const CelebrityBotsModal: React.FC<CelebrityBotsModalProps> = ({
  isOpen,
  onClose,
  onSelectBot,
  currentSelectedBotId
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                Dunyodagi TOP 10 Shaxmatchilar Botlari
              </h2>
              <p className="text-xs text-slate-400">
                O'zbekiston yulduzlari Nodirbek Abdusattorov, Javohir Sindorov hamda Magnus Carlsen, Hikaru kabi afsonalar bilan bellashing!
              </p>
            </div>
          </div>
          <button
            id="close-celebrity-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Bot Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {CELEBRITY_BOTS.map((bot) => {
            const isSelected = currentSelectedBotId === bot.id;
            const isUzbekStar = bot.countryCode === 'UZ';

            return (
              <div
                key={bot.id}
                id={`bot-card-${bot.id}`}
                className={`relative group flex flex-col justify-between p-4 rounded-2xl border transition-all duration-200 ${
                  isUzbekStar
                    ? 'bg-gradient-to-b from-slate-800/90 to-emerald-950/30 border-emerald-500/40 hover:border-emerald-400/80 shadow-emerald-900/10'
                    : 'bg-slate-800/70 hover:bg-slate-800 border-slate-700/60 hover:border-slate-600'
                } ${isSelected ? 'ring-2 ring-amber-400/80 !border-amber-400' : ''}`}
              >
                <div>
                  {/* Top bar: Avatar + Names + ELO */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="relative shrink-0">
                      <img
                        src={bot.avatarUrl}
                        alt={bot.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-600 shadow-md group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute -bottom-1 -right-1 text-base shadow-sm">
                        {bot.flag}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="text-base font-bold text-white truncate group-hover:text-emerald-300 transition-colors">
                          {bot.name}
                        </h3>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold text-xs">
                          {bot.elo} ELO
                        </span>
                      </div>
                      <p className="text-xs font-medium text-emerald-400/90 mt-0.5">
                        {bot.title}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-1 italic">
                        "{bot.greeting}"
                      </p>
                    </div>
                  </div>

                  {/* Playstyle Badge */}
                  <div className="mb-3 px-2.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-[11px] text-slate-300 flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="line-clamp-1">{bot.styleUz}</span>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-4">
                    {bot.bio}
                  </p>
                </div>

                {/* Action button */}
                <button
                  id={`select-bot-${bot.id}`}
                  onClick={() => {
                    onSelectBot(bot);
                    onClose();
                  }}
                  className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all ${
                    isUzbekStar
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20'
                      : 'bg-slate-700 hover:bg-slate-600 text-white'
                  }`}
                >
                  <Swords className="w-4 h-4" />
                  <span>{isSelected ? "Hozir tanlangan" : "Ushbu Grossmeyster bilan o'ynash"}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Botlar o'z xarakterli debyutlari va haqiqiy ELO kuchiga moslashgan holda harakat qiladi</span>
          </div>
          <span className="text-amber-400/90 font-medium">10 ta mashhur grossmeyster</span>
        </div>
      </div>
    </div>
  );
};
