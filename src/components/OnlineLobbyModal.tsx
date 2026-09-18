import React, { useState, useEffect } from 'react';
import { OnlinePlayerInfo, TimeControlOption } from '../types';
import { GLOBAL_OPPONENT_POOL } from '../utils/onlineService';
import { TIME_CONTROLS } from '../data/timeControls';
import { Globe, Users, Wifi, Search, Play, Copy, Check, ArrowRight, X, Shield, Sparkles } from 'lucide-react';

interface OnlineLobbyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartOnlineMatch: (opponent: OnlinePlayerInfo, playerColor: 'w' | 'b', timeControl: TimeControlOption, roomId: string) => void;
  userElo: number;
}

export const OnlineLobbyModal: React.FC<OnlineLobbyModalProps> = ({
  isOpen,
  onClose,
  onStartOnlineMatch,
  userElo
}) => {
  const [activeTab, setActiveTab] = useState<'random' | 'room'>('random');
  const [selectedTimeControl, setSelectedTimeControl] = useState<TimeControlOption>(
    TIME_CONTROLS.find((t) => t.id === 'blitz-5-0') || TIME_CONTROLS[3]
  );
  const [isSearching, setIsSearching] = useState(false);
  const [searchStep, setSearchStep] = useState<string>('');
  const [foundOpponent, setFoundOpponent] = useState<OnlinePlayerInfo | null>(null);
  const [roomCode, setRoomCode] = useState<string>('');
  const [inputRoomCode, setInputRoomCode] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && !roomCode) {
      // Generate a random 6-character room code e.g. UZB-742
      const randomNum = Math.floor(100 + Math.random() * 900);
      setRoomCode(`UZB-${randomNum}`);
    }
  }, [isOpen, roomCode]);

  if (!isOpen) return null;

  const handleStartRandomSearch = () => {
    setIsSearching(true);
    setFoundOpponent(null);
    setSearchStep('Dunyo bo\'yicha serverlarga ulanmoqda...');

    setTimeout(() => {
      setSearchStep(`Reytingingizga yaqin raqib izlanmoqda (${userElo} ±150 ELO)...`);
    }, 1200);

    setTimeout(() => {
      // Find opponent close to user ELO or pick random from pool
      const sortedPool = [...GLOBAL_OPPONENT_POOL].sort(
        (a, b) => Math.abs(a.elo - userElo) - Math.abs(b.elo - userElo)
      );
      const chosen = sortedPool[Math.floor(Math.random() * Math.min(4, sortedPool.length))];
      setFoundOpponent(chosen);
      setSearchStep('Raqib topildi! O\'yin boshlanmoqda...');
    }, 2800);

    setTimeout(() => {
      const playerColor = Math.random() > 0.5 ? 'w' : 'b';
      // Find chosen opponent
      const sortedPool = [...GLOBAL_OPPONENT_POOL].sort(
        (a, b) => Math.abs(a.elo - userElo) - Math.abs(b.elo - userElo)
      );
      const chosen = sortedPool[Math.floor(Math.random() * Math.min(4, sortedPool.length))];
      onStartOnlineMatch(chosen, playerColor, selectedTimeControl, `random_${Date.now()}`);
      setIsSearching(false);
      setFoundOpponent(null);
      onClose();
    }, 4200);
  };

  const handleJoinRoom = () => {
    if (!inputRoomCode.trim()) return;
    const opponent: OnlinePlayerInfo = {
      id: 'friend_' + inputRoomCode,
      name: 'Jonli Raqib (Xona: ' + inputRoomCode.toUpperCase() + ')',
      country: "O'zbekiston",
      countryCode: 'UZ',
      flag: '🇺🇿',
      elo: userElo,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      pingMs: 15
    };
    onStartOnlineMatch(opponent, 'w', selectedTimeControl, inputRoomCode.toUpperCase());
    onClose();
  };

  const handleCreateRoom = () => {
    const opponent: OnlinePlayerInfo = {
      id: 'friend_' + roomCode,
      name: 'Jonli Raqib (Kutilmoqda...)',
      country: "O'zbekiston",
      countryCode: 'UZ',
      flag: '🇺🇿',
      elo: userElo,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
      pingMs: 12
    };
    onStartOnlineMatch(opponent, 'b', selectedTimeControl, roomCode);
    onClose();
  };

  const copyRoomCode = () => {
    navigator.clipboard?.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Globe className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                Dunyo Bo'ylab Onlayn Shaxmat
              </h2>
              <p className="text-xs text-slate-400">
                Internet orqali real vaqtda tasodifiy o'yinchilar yoki do'stlaringiz bilan bellashing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 flex flex-col gap-5">
          {/* Navigation Tabs */}
          <div className="flex rounded-xl bg-slate-950/60 p-1 border border-slate-800">
            <button
              onClick={() => {
                if (!isSearching) setActiveTab('random');
              }}
              className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-all ${
                activeTab === 'random'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Tasodifiy Raqib Qidirish (Dunyo bo'ylab)</span>
            </button>
            <button
              onClick={() => {
                if (!isSearching) setActiveTab('room');
              }}
              className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-all ${
                activeTab === 'room'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Do'st bilan Xona (Xona Kodi)</span>
            </button>
          </div>

          {/* Time Control Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Vaqt Nazorati (Format tanlang):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TIME_CONTROLS.filter((tc) => tc.id !== 'unlimited').map((tc) => {
                const isSelected = selectedTimeControl.id === tc.id;
                return (
                  <button
                    key={tc.id}
                    onClick={() => setSelectedTimeControl(tc)}
                    disabled={isSearching}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300 ring-1 ring-emerald-400'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{tc.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900/60 text-amber-400">
                        {tc.badge}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block capitalize">
                      {tc.type}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab 1: Random Matchmaking */}
          {activeTab === 'random' && (
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-800/40 border border-slate-700/60">
              {isSearching ? (
                <div className="flex flex-col items-center text-center py-4">
                  {/* Radar search animation */}
                  <div className="relative w-28 h-28 flex items-center justify-center mb-4">
                    <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 animate-ping" />
                    <div className="absolute inset-2 rounded-full border border-emerald-500/40 animate-pulse" />
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center text-emerald-400">
                      <Globe className="w-8 h-8 animate-spin" style={{ animationDuration: '8s' }} />
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-white mb-1">
                    {searchStep}
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Server: Frankfurt (Ping: ~28ms)</span>
                  </p>

                  {foundOpponent && (
                    <div className="mt-4 p-3 rounded-xl bg-slate-900/90 border border-emerald-500/50 flex items-center gap-3 animate-fade-in">
                      <img
                        src={foundOpponent.avatarUrl}
                        alt={foundOpponent.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover border border-emerald-400"
                      />
                      <div className="text-left">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-white">
                            {foundOpponent.name}
                          </span>
                          <span>{foundOpponent.flag}</span>
                        </div>
                        <span className="text-xs text-amber-400 font-mono font-semibold">
                          {foundOpponent.elo} ELO
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full flex flex-col items-center text-center py-2">
                  <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-emerald-400 mb-3 border border-slate-700">
                    <Globe className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">
                    Global Matchmaking
                  </h3>
                  <p className="text-xs text-slate-400 max-w-md mb-5">
                    Tizim sizning joriy <span className="text-amber-400 font-semibold">{userElo} ELO</span> darajangizga mos dunyodagi o'yinchilardan birini avtomatik topadi va partiyani boshlaydi.
                  </p>
                  <button
                    id="find-random-match-btn"
                    onClick={handleStartRandomSearch}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all hover:scale-105"
                  >
                    <Search className="w-4 h-4" />
                    <span>Tasodifiy Raqib Bilan O'ynash</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Room Code */}
          {activeTab === 'room' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Create Room */}
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Yangi Xona Yaratish
                  </h4>
                  <p className="text-xs text-slate-400 mb-3">
                    Ushbu kodni do'stingizga yuboring yoki boshqa brauzer oynasida kiring:
                  </p>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex-1 py-2 px-3 rounded-xl bg-slate-950 font-mono font-bold text-center text-emerald-400 tracking-widest border border-slate-800 text-lg">
                      {roomCode}
                    </div>
                    <button
                      onClick={copyRoomCode}
                      className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
                      title="Nusxa olish"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  id="create-room-btn"
                  onClick={handleCreateRoom}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Play className="w-4 h-4" />
                  <span>Xonani ochish va kutish</span>
                </button>
              </div>

              {/* Join Room */}
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-emerald-400" />
                    Mavjud Xonaga Ulanish
                  </h4>
                  <p className="text-xs text-slate-400 mb-3">
                    Do'stingiz yuborgan 6 xonali kodni kiriting:
                  </p>
                  <input
                    type="text"
                    placeholder="Masalan: UZB-742"
                    value={inputRoomCode}
                    onChange={(e) => setInputRoomCode(e.target.value.toUpperCase())}
                    className="w-full py-2 px-3 rounded-xl bg-slate-950 text-white font-mono uppercase tracking-widest border border-slate-700 focus:border-emerald-500 focus:outline-none text-center text-base mb-4"
                  />
                </div>

                <button
                  id="join-room-btn"
                  onClick={handleJoinRoom}
                  disabled={!inputRoomCode.trim()}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-700 hover:bg-emerald-600 disabled:opacity-50 disabled:hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Play className="w-4 h-4" />
                  <span>Xonaga kirish</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Onlayn reyting o'yini rasmiy shaxmat qoidalariga asoslangan</span>
          </div>
          <span className="text-emerald-400 font-medium">Jonli ulanish faol</span>
        </div>
      </div>
    </div>
  );
};
