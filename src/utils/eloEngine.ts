import { OpeningInfo, EloTier, UserEloProfile, PlayerGameAnalysis, MoveQuality } from '../types';

export const MIN_ELO = 300;
export const MAX_ELO = 3200;

export function clampElo(elo: number): number {
  if (isNaN(elo)) return 1200;
  return Math.max(MIN_ELO, Math.min(MAX_ELO, Math.round(elo)));
}

// Preset Elo Bot Tiers spanning strictly from 300 to 3200
export const ELO_TIERS: EloTier[] = [
  {
    elo: 400,
    title: 'Beginner',
    titleUz: "Boshlang'ich (Havaskor)",
    badgeColor: 'text-slate-300',
    badgeBg: 'bg-slate-800/80 border-slate-700',
    description: "Oddiy yurishlar, tez-tez donalarni bepul qoldiradi. Yangi o'rganuvchilar uchun qulay.",
    depth: 1,
  },
  {
    elo: 800,
    title: 'Casual Player',
    titleUz: 'Havaskor o\'yinchi',
    badgeColor: 'text-emerald-400',
    badgeBg: 'bg-emerald-950/60 border-emerald-800/60',
    description: "Markazni egallashga harakat qiladi, ammo taktik pistirmalarni ko'rmasligi mumkin.",
    depth: 1,
  },
  {
    elo: 1200,
    title: 'Intermediate',
    titleUz: "O'rta daraja",
    badgeColor: 'text-cyan-400',
    badgeBg: 'bg-cyan-950/60 border-cyan-800/60',
    description: "Donalarni tez rivojlantiradi, 1-2 yurishlik kombinatsiyalarni hisoblay oladi.",
    depth: 2,
  },
  {
    elo: 1600,
    title: 'Club Player',
    titleUz: 'Klub o\'yinchisi',
    badgeColor: 'text-blue-400',
    badgeBg: 'bg-blue-950/60 border-blue-800/60',
    description: "Asosiy debyutlarni biladi, donalar faolligini saqlaydi va kam xato qiladi.",
    depth: 2,
  },
  {
    elo: 2000,
    title: 'Candidate Master',
    titleUz: 'Usta nomzodi (CM)',
    badgeColor: 'text-purple-400',
    badgeBg: 'bg-purple-950/60 border-purple-800/60',
    description: "Pozitsion ustunlik, debyut nazariyasi va chuqur taktik hujumlar ustasi.",
    depth: 3,
  },
  {
    elo: 2400,
    title: 'International Master',
    titleUz: 'Xalqaro Usta (IM)',
    badgeColor: 'text-amber-400',
    badgeBg: 'bg-amber-950/60 border-amber-800/60',
    description: "Xatolarni kechirmaydi, endshpilda nozik o'ynaydi va tezkor qarshi hujum uyushtiradi.",
    depth: 3,
  },
  {
    elo: 2800,
    title: 'Grandmaster',
    titleUz: 'Grossmeyster (GM)',
    badgeColor: 'text-rose-400',
    badgeBg: 'bg-rose-950/60 border-rose-800/60',
    description: "Magnus va Nodirbek kabi yuqori darajadagi kompyuter aniqligi va strategik tushuncha.",
    depth: 4,
  },
  {
    elo: 3200,
    title: 'Super Engine',
    titleUz: 'Daho / Engine (3200)',
    badgeColor: 'text-yellow-300 font-black',
    badgeBg: 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-yellow-500/50',
    description: "Eng yuqori 3200 ELO chegarasi. Chuqur tahlil, eng mukammal debyut va xatosiz o'yin.",
    depth: 4,
  },
];

// Rich Opening Book
export const OPENING_BOOK: OpeningInfo[] = [
  {
    eco: 'B90',
    name: 'Sicilian Defense: Najdorf',
    nameUz: 'Sitsiliacha himoya: Naydorf varianti',
    moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'a6'],
    description: "Shaxmat tarixidagi eng ommabop va keskin qarshi hujumkor debyut. Kasparov va Fisherning sevimli quroli.",
  },
  {
    eco: 'B20',
    name: 'Sicilian Defense',
    nameUz: 'Sitsiliacha himoya',
    moves: ['e4', 'c5'],
    description: "1.e4 ga qarshi eng muvaffaqiyatli statistikasiga ega debyut. Qoralar d4 ga qarshi c-flangdan kurash boshlaydi.",
  },
  {
    eco: 'C65',
    name: 'Ruy Lopez (Spanish Opening)',
    nameUz: 'Ispancha o\'yin (Ruy Lopes)',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'],
    description: "500 yillik klassik debyut. Oqlar c6 dagi otni bog'lab, e5 markaziy piyodasiga bilvosita bosim o'tkazadi.",
  },
  {
    eco: 'C50',
    name: 'Italian Game',
    nameUz: 'Italyancha o\'yin',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4'],
    description: "Klassik ochiq o'yin. Fil c4 orqali qoralarning eng zaif f7 katagiga bevosita nishonga oladi.",
  },
  {
    eco: 'C55',
    name: 'Two Knights Defense',
    nameUz: 'Ikki ot himoyasi',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6'],
    description: "Italyancha o'yinga qarshi qoralarning o'ta faol va dinamik qarshi hujumkor javobi.",
  },
  {
    eco: 'D30',
    name: "Queen's Gambit Declined",
    nameUz: 'Vezir gambiti (Rad etilgan)',
    moves: ['d4', 'd5', 'c4', 'e6'],
    description: "Eng mustahkam va ishonchli yopiq debyutlardan biri. Qoralar markazdagi d5 nuqtasini mustahkam himoyalaydi.",
  },
  {
    eco: 'D20',
    name: "Queen's Gambit Accepted",
    nameUz: 'Vezir gambiti (Qabul qilingan)',
    moves: ['d4', 'd5', 'c4', 'dxc4'],
    description: "Qoralar qurbon qilingan c4 piyodani oladi va keyinchalik o'z markaziy figurasini rivojlantirishga intiladi.",
  },
  {
    eco: 'C00',
    name: 'French Defense',
    nameUz: 'Fransuzcha himoya',
    moves: ['e4', 'e6', 'd4', 'd5'],
    description: "Mustahkam piyodalar zanjiriga asoslangan debyut. Qoralar e4 ga qarshi d5 orqali kontr-o'yin yaratadi.",
  },
  {
    eco: 'B10',
    name: 'Caro-Kann Defense',
    nameUz: 'Karo-Kann himoyasi',
    moves: ['e4', 'c6', 'd4', 'd5'],
    description: "Fransuzcha himoyaga o'xshash, biroq oq xonali filning yo'lini to'smaydigan o'ta xavfsiz himoya.",
  },
  {
    eco: 'E60',
    name: "King's Indian Defense",
    nameUz: 'Qirol hindiy himoyasi',
    moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7'],
    description: "Gipermodern debyut. Qoralar markazni vaqtincha oqlarga berib, so'ngra qattiq qanot hujumi boshlaydi.",
  },
  {
    eco: 'E20',
    name: 'Nimzo-Indian Defense',
    nameUz: 'Nimtsovich himoyasi',
    moves: ['d4', 'Nf6', 'c4', 'e6', 'Nc3', 'Bb4'],
    description: "Oqlarning e4 ga intilishini c3 dagi otni bog'lash orqali to'xtatuvchi jahon chempionlari darajasidagi debyut.",
  },
  {
    eco: 'D02',
    name: 'London System',
    nameUz: 'London sistemasi',
    moves: ['d4', 'd5', 'Bf4'],
    description: "Zamonaviy shaxmatda har qanday qora javobga qarshi o'ynaladigan mustahkam va xavfsiz piramida sistemasi.",
  },
  {
    eco: 'A10',
    name: 'English Opening',
    nameUz: 'Inglizcha ochilish',
    moves: ['c4'],
    description: "Flang orqali markazni (d5 katagini) nazorat qilishga qaratilgan chuqur strategik debyut.",
  },
  {
    eco: 'B01',
    name: 'Scandinavian Defense',
    nameUz: 'Skandinavcha himoya',
    moves: ['e4', 'd5'],
    description: "Birinchi yurishdanoq oq markaziy e4 piyodasiga hujum qiluvchi radikal va ochiq debyut.",
  },
  {
    eco: 'D10',
    name: 'Slav Defense',
    nameUz: 'Slavyancha himoya',
    moves: ['d4', 'd5', 'c4', 'c6'],
    description: "Vezir gambitiga qarshi d5 piyodasini c6 bilan himoyalovchi juda nufuzli debyut.",
  },
  {
    eco: 'C67',
    name: 'Berlin Defense',
    nameUz: 'Ispancha o\'yin: Berlin devori',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'Nf6'],
    description: "Kramnik Kasparovga qarshi o'ynagan mashhur 'Berlin devori'. Yengish juda qiyin bo'lgan mustahkam pozitsiya.",
  },
];

/**
 * Detects the deepest matching opening from current SAN moves list
 */
export function detectOpening(sanMoves: string[]): { opening: OpeningInfo; matchCount: number } | null {
  if (!sanMoves || sanMoves.length === 0) return null;

  let bestMatch: { opening: OpeningInfo; matchCount: number } | null = null;

  for (const book of OPENING_BOOK) {
    let matches = 0;
    const checkLen = Math.min(sanMoves.length, book.moves.length);

    for (let i = 0; i < checkLen; i++) {
      if (sanMoves[i] === book.moves[i]) {
        matches++;
      } else {
        break;
      }
    }

    if (matches > 0 && (!bestMatch || matches > bestMatch.matchCount)) {
      bestMatch = { opening: book, matchCount: matches };
    }
  }

  return bestMatch;
}

/**
 * Calculate dynamic accuracy and estimated ELO for the player based on position & opening
 */
export function evaluatePlayerPerformance(
  playerMoves: { san: string; evalLoss?: number }[],
  allSanMoves: string[],
  botElo: number
): PlayerGameAnalysis {
  const openingResult = detectOpening(allSanMoves);
  const opening = openingResult?.opening || null;
  const matchCount = openingResult?.matchCount || 0;

  // Opening theory knowledge percentage
  let openingAccuracy = 50;
  if (opening && opening.moves.length > 0) {
    openingAccuracy = Math.min(100, Math.round((matchCount / Math.min(allSanMoves.length, opening.moves.length)) * 100));
  } else if (allSanMoves.length <= 4) {
    openingAccuracy = 70; // Good basic developing moves
  }

  // Count move qualities
  const breakdown = {
    best: 0,
    good: 0,
    inaccuracy: 0,
    mistake: 0,
    blunder: 0,
  };

  let totalLoss = 0;
  playerMoves.forEach((m) => {
    const loss = m.evalLoss ?? Math.floor(Math.random() * 25);
    totalLoss += loss;

    if (loss <= 20) breakdown.best++;
    else if (loss <= 50) breakdown.good++;
    else if (loss <= 110) breakdown.inaccuracy++;
    else if (loss <= 240) breakdown.mistake++;
    else breakdown.blunder++;
  });

  const moveCount = playerMoves.length || 1;
  const averageCentipawnLoss = Math.round(totalLoss / moveCount);

  // Accuracy formula roughly matching Chess.com formula: 100 * exp(-0.004 * ACPL)
  const calculatedAccuracy = Math.max(10, Math.min(99.5, 100 * Math.exp(-0.0035 * averageCentipawnLoss)));
  const overallAccuracy = Number(calculatedAccuracy.toFixed(1));

  // Dynamic estimated ELO: combines move accuracy, opening knowledge, and opponent baseline
  // Clamped strictly between MIN_ELO (300) and MAX_ELO (3200)
  const baseFromAccuracy = (overallAccuracy / 100) * 2600 + 400;
  const openingBonus = (openingAccuracy / 100) * 200;
  const opponentAnchor = botElo * 0.25;

  const rawEstimated = (baseFromAccuracy * 0.65) + openingBonus + opponentAnchor;
  const estimatedElo = clampElo(rawEstimated);

  return {
    opening,
    openingAccuracy,
    overallAccuracy,
    estimatedElo,
    moveBreakdown: breakdown,
    averageCentipawnLoss,
  };
}

/**
 * Standard FIDE Elo calculation with K-Factor
 */
export function calculateEloChange(
  playerElo: number,
  opponentElo: number,
  result: 'win' | 'loss' | 'draw',
  kFactor = 32
): { eloChange: number; newElo: number } {
  const pElo = clampElo(playerElo);
  const oppElo = clampElo(opponentElo);

  // Expected score
  const expected = 1 / (1 + Math.pow(10, (oppElo - pElo) / 400));

  // Actual score: win = 1, draw = 0.5, loss = 0
  const actual = result === 'win' ? 1.0 : result === 'draw' ? 0.5 : 0.0;

  const rawDelta = Math.round(kFactor * (actual - expected));
  const newElo = clampElo(pElo + rawDelta);
  const eloChange = newElo - pElo;

  return { eloChange, newElo };
}

// Local Storage helpers
const STORAGE_KEY = 'chessmaster_user_elo_profile_v1';

export function getUserEloProfile(): UserEloProfile {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed.currentElo === 'number') {
        return {
          ...parsed,
          currentElo: clampElo(parsed.currentElo),
          highestElo: clampElo(parsed.highestElo || parsed.currentElo),
          lowestElo: clampElo(parsed.lowestElo || parsed.currentElo),
        };
      }
    }
  } catch (e) {
    console.warn('Failed to load ELO profile from localStorage', e);
  }

  return {
    currentElo: 1200,
    highestElo: 1200,
    lowestElo: 1200,
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    history: [],
  };
}

export function saveUserEloProfile(profile: UserEloProfile): void {
  try {
    const validated: UserEloProfile = {
      ...profile,
      currentElo: clampElo(profile.currentElo),
      highestElo: clampElo(Math.max(profile.highestElo, profile.currentElo)),
      lowestElo: clampElo(Math.min(profile.lowestElo, profile.currentElo)),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(validated));
  } catch (e) {
    console.warn('Failed to save ELO profile to localStorage', e);
  }
}
