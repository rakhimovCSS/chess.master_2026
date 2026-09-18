import React, { useState, useEffect } from 'react';
import { Crown, Menu, X, Play, BookOpen, Users, Home, Trophy, Globe } from 'lucide-react';
import { getUserEloProfile } from '../utils/eloEngine';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userElo, setUserElo] = useState<number>(1200);

  useEffect(() => {
    const profile = getUserEloProfile();
    setUserElo(profile.currentElo);
  }, []);

  const navLinks = [
    { name: 'Bosh sahifa', href: '#hero', icon: Home },
    { name: "O'yin", href: '#game-section', icon: Play },
    { name: 'Top 100 Reyting', href: '#leaderboard-section', icon: Trophy },
    { name: 'Qoidalar', href: '#rules-section', icon: BookOpen },
    { name: 'Grossmeysterlar', href: '#grandmasters-section', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Crown className="w-6 h-6 fill-current" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white font-['Cinzel',serif] flex items-center gap-1">
                Chess<span className="text-amber-400">Master</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-semibold -mt-1">
                Uzbek Chess Arena
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Quick Play CTA & User ELO */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#game-section"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-amber-500/30 text-xs font-bold text-amber-400 font-mono shadow-sm hover:border-amber-500/60 transition"
              title="Sizning joriy ELO reytingingiz"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>{userElo} ELO</span>
            </a>

            <a
              href="#game-section"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all transform hover:-translate-y-0.5"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>O'ynash</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
              aria-label="Menyu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 px-4 pt-2 pb-6 space-y-3 backdrop-blur-xl animate-scale-in">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium text-slate-200 hover:bg-slate-900 hover:text-amber-400 transition"
              >
                <Icon className="w-5 h-5 text-emerald-400" />
                <span>{link.name}</span>
              </a>
            );
          })}

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono text-amber-400 font-bold flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              {userElo} ELO Reyting
            </span>
            <a
              href="#game-section"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
            >
              O'yinni boshlash
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
