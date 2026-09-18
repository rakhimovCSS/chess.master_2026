import React from 'react';
import { Crown, Send, Youtube, Github, Twitter, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-md">
                <Crown className="w-6 h-6 fill-current" />
              </div>
              <span className="text-xl font-black tracking-tight text-white font-['Cinzel',serif]">
                Chess<span className="text-amber-400">Master</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              O'zbekistonda shaxmat madaniyatini rivojlantirish va yoshlarning strategik tafakkurini yuksaltirishga qaratilgan zamonaviy interaktiv platforma.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://t.me"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 flex items-center justify-center border border-slate-800 transition shadow-sm"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-rose-500 hover:text-white text-slate-300 flex items-center justify-center border border-slate-800 transition shadow-sm"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-amber-400 hover:text-slate-950 text-slate-300 flex items-center justify-center border border-slate-800 transition shadow-sm"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-sky-400 hover:text-slate-950 text-slate-300 flex items-center justify-center border border-slate-800 transition shadow-sm"
                aria-label="Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Tezkor Havolalar
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#hero" className="hover:text-amber-400 transition-colors">
                  Bosh sahifa
                </a>
              </li>
              <li>
                <a href="#game-section" className="hover:text-amber-400 transition-colors">
                  Bot bilan o'yin
                </a>
              </li>
              <li>
                <a href="#rules-section" className="hover:text-amber-400 transition-colors">
                  Qoidalar va Debyutlar
                </a>
              </li>
              <li>
                <a href="#grandmasters-section" className="hover:text-amber-400 transition-colors">
                  Mashhur Grossmeysterlar
                </a>
              </li>
            </ul>
          </div>

          {/* Chess Quote */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Shaxmat Donoligi
            </h4>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs leading-relaxed text-slate-300 italic">
              "Shaxmat hamma narsani — san'at, fan va sportni o'zida birlashtirgan noyob mo''jizadir."
              <span className="block mt-2 font-semibold not-italic text-amber-400">
                — Anatoliy Karpov
              </span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2025 ChessMaster. Barcha huquqlar himoyalangan.</p>
          <p className="flex items-center gap-1">
            <span>Shaxmat muxlislari uchun</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current inline" />
            <span>bilan yaratildi</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
