/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ChessGame } from './components/ChessGame';
import { RulesSection } from './components/RulesSection';
import { GrandmastersSection } from './components/GrandmastersSection';
import { Top100Leaderboard } from './components/Top100Leaderboard';
import { Footer } from './components/Footer';

export default function App() {
  const [selectedBotToPlay, setSelectedBotToPlay] = useState<string | null>(null);

  const handleChallengeBot = (botId: string) => {
    setSelectedBotToPlay(botId);
    const el = document.getElementById('game-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-black">
      {/* 1. Header & Navigation Bar */}
      <Header />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <Hero />

        {/* 3. Interactive Chess Game Section (Bots, Online Multiplayer, Time Controls, Clock) */}
        <ChessGame
          selectedBotToPlay={selectedBotToPlay}
          onBotClear={() => setSelectedBotToPlay(null)}
        />

        {/* 4. Top 100 World Chess Players Live Leaderboard */}
        <Top100Leaderboard onChallengeCelebrityBot={handleChallengeBot} />

        {/* 5. Chess Rules and Strategies Guide */}
        <RulesSection />

        {/* 6. Grandmasters Gallery with Bot Challenges */}
        <GrandmastersSection onChallengeBot={handleChallengeBot} />
      </main>

      {/* 7. Footer */}
      <Footer />
    </div>
  );
}
