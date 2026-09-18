import React, { useState } from 'react';
import { WorldTopPlayer } from '../types';
import { TOP_100_PLAYERS } from '../data/top100Players';
import { CELEBRITY_BOTS } from '../data/celebrityBots';
import { Trophy, Search, RefreshCw, Swords, Shield, Star, Filter, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface Top100LeaderboardProps {
  onChallengeCelebrityBot?: (botId: string) => void;
}

export const Top100Leaderboard: React.FC<Top100LeaderboardProps> = ({
  onChallengeCelebrityBot
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'top10' | 'uzb' | 'youth'>('all');
  const [playersList, setPlayersList] = useState<WorldTopPlayer[]>(TOP_100_PLAYERS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('Bugun, Jonli');

  const handleRefreshRatings = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Simulate live rating updates
      const updated = playersList.map((p) => {
        if (Math.random() < 0.15) {
          const delta = (Math.random() > 0.5 ? 1 : -1) * Math.floor(1 + Math.random() * 3);
          return {
            ...p,
            rating: p.rating + delta,
            change: delta > 0 ? 1 : delta < 0 ? -1 : 0
          };
        }
        return p;
      });
      // Re-sort by rating
      updated.sort((a, b) => b.rating - a.rating);
      const reranked = updated.map((p, idx) => ({ ...p, rank: idx + 1 }));
      setPlayersList(reranked);
      setIsRefreshing(false);
      setLastUpdated(new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 800);
  };

  const filteredPlayers = playersList.filter((player) => {
    // Search query filter
    const matchesQuery =
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.countryCode.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesQuery) return false;

    // Category filter
    if (selectedFilter === 'top10') {
      return player.rank <= 10;
    }
    if (selectedFilter === 'uzb') {
      return player.countryCode === 'UZ';
    }
    if (selectedFilter === 'youth') {
      return player.birthYear >= 2003;
    }
    return true;
  });

  return (
    <div id="top100-section" className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-8 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-emerald-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                FIDE Dunyo TOP 100 Shaxmatchilari Reytingi
              </h2>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium text-xs">
                Jonli nazorat
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Xalqaro Shaxmat Federatsiyasi (FIDE) rasmiy reytingi. Yangilanish: <span className="text-slate-200 font-mono">{lastUpdated}</span>
            </p>
          </div>
        </div>

        {/* Live Refresh Button */}
        <div className="flex items-center gap-3 self-start lg:self-auto">
          <button
            id="refresh-top100-btn"
            onClick={handleRefreshRatings}
            disabled={isRefreshing}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            title="Reytinglarni jonli tekshirish"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{isRefreshing ? "Yangilanmoqda..." : "Jonli yangilash"}</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 my-6">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Shaxmatchi ismi yoki davlatini qidiring (masalan: Nodirbek, O'zbekiston, Carlsen)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedFilter === 'all'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Barchasi (100)
          </button>
          <button
            onClick={() => setSelectedFilter('top10')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedFilter === 'top10'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            TOP 10
          </button>
          <button
            onClick={() => setSelectedFilter('uzb')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedFilter === 'uzb'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800 text-emerald-400 hover:bg-slate-700'
            }`}
          >
            <span>🇺🇿</span>
            <span>O'zbekiston Yulduzlari</span>
          </button>
          <button
            onClick={() => setSelectedFilter('youth')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedFilter === 'youth'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-amber-400" />
            <span>Yosh vunderkindlar</span>
          </button>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4 text-center w-14">#</th>
              <th className="py-3 px-4">Grossmeyster</th>
              <th className="py-3 px-4 text-center">Davlat</th>
              <th className="py-3 px-4 text-right">Klassik ELO</th>
              <th className="py-3 px-4 text-right hidden sm:table-cell">Rapid</th>
              <th className="py-3 px-4 text-right hidden md:table-cell">Blitz</th>
              <th className="py-3 px-4 text-center hidden lg:table-cell">Tug'ilgan yili</th>
              <th className="py-3 px-4 text-center w-28">Harakat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs sm:text-sm">
            {filteredPlayers.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  Hech qanday shaxmatchi topilmadi. Qidiruv so'zini o'zgartirib ko'ring.
                </td>
              </tr>
            ) : (
              filteredPlayers.map((player) => {
                const isUzbek = player.countryCode === 'UZ';
                const isTop3 = player.rank <= 3;
                const hasBot = Boolean(player.isCelebrityBotAvailable && player.botId);

                return (
                  <tr
                    key={player.rank}
                    id={`player-row-${player.rank}`}
                    className={`transition-colors hover:bg-slate-800/60 ${
                      isUzbek ? 'bg-emerald-950/20' : ''
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-3.5 px-4 text-center font-mono font-bold">
                      {isTop3 ? (
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-extrabold ${
                            player.rank === 1
                              ? 'bg-amber-400 text-slate-950'
                              : player.rank === 2
                              ? 'bg-slate-300 text-slate-950'
                              : 'bg-amber-700 text-white'
                          }`}
                        >
                          {player.rank}
                        </span>
                      ) : (
                        <span className="text-slate-400">{player.rank}</span>
                      )}
                    </td>

                    {/* Name & Title */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-amber-400 border border-slate-700">
                          {player.title}
                        </span>
                        <span className={`font-semibold ${isUzbek ? 'text-emerald-300 font-bold' : 'text-slate-100'}`}>
                          {player.name}
                        </span>
                        {isUzbek && (
                          <span className="text-xs px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px]">
                            O'zbekiston Faxri
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Country & Flag */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className="text-base mr-1.5">{player.flag}</span>
                      <span className="text-xs text-slate-300 hidden sm:inline">{player.country}</span>
                    </td>

                    {/* Classical Rating */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-white whitespace-nowrap">
                      <span className="text-emerald-400 mr-1.5">{player.rating}</span>
                      {player.change > 0 ? (
                        <span className="inline-flex items-center text-[10px] text-emerald-400">
                          <ArrowUpRight className="w-3 h-3" />
                        </span>
                      ) : player.change < 0 ? (
                        <span className="inline-flex items-center text-[10px] text-red-400">
                          <ArrowDownRight className="w-3 h-3" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[10px] text-slate-500">
                          <Minus className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </td>

                    {/* Rapid */}
                    <td className="py-3.5 px-4 text-right font-mono text-slate-300 hidden sm:table-cell">
                      {player.rapidRating || '—'}
                    </td>

                    {/* Blitz */}
                    <td className="py-3.5 px-4 text-right font-mono text-slate-300 hidden md:table-cell">
                      {player.blitzRating || '—'}
                    </td>

                    {/* Birth Year */}
                    <td className="py-3.5 px-4 text-center font-mono text-slate-400 hidden lg:table-cell">
                      {player.birthYear}
                    </td>

                    {/* Action: Challenge Bot */}
                    <td className="py-3.5 px-4 text-center">
                      {hasBot ? (
                        <button
                          id={`challenge-bot-${player.botId}`}
                          onClick={() => {
                            if (onChallengeCelebrityBot && player.botId) {
                              onChallengeCelebrityBot(player.botId);
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-400 hover:text-amber-300 font-semibold text-xs flex items-center justify-center gap-1 transition-all mx-auto"
                          title="Ushbu Grossmeyster boti bilan bellashing"
                        >
                          <Swords className="w-3.5 h-3.5" />
                          <span>Bot bilan</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500">FIDE Top</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Notes */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2">
        <span>Ko'rsatilmoqda: {filteredPlayers.length} / {playersList.length} grossmeyster</span>
        <span className="flex items-center gap-1.5 text-slate-400">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>FIDE rasmiy xalqaro reyting ro'yxati asosida tuzilgan</span>
        </span>
      </div>
    </div>
  );
};
