import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Chess, Square, Move } from 'chess.js';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  RotateCw,
  Undo2,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
  Swords,
  Trophy,
  AlertTriangle,
  Lightbulb,
  Copy,
  Check,
  Award,
  Sliders,
  Flame,
  ShieldAlert,
  GraduationCap,
  Globe,
  Timer,
  Palette,
  MessageSquare,
  Crown,
  Wifi,
  Smile
} from 'lucide-react';
import { Board } from './Board';
import { ChessPiece } from './ChessPiece';
import { ChessClock } from './ChessClock';
import { EloAnalysisPanel } from './EloAnalysisPanel';
import { EloGameOverModal } from './EloGameOverModal';
import { CelebrityBotsModal } from './CelebrityBotsModal';
import { OnlineLobbyModal } from './OnlineLobbyModal';
import {
  MoveHistoryItem,
  GameMode,
  UserEloProfile,
  BoardTheme,
  CelebrityBot,
  TimeControlOption,
  OnlinePlayerInfo
} from '../types';
import { chessAudio } from '../utils/audio';
import { getBotMove, evaluateBoard } from '../utils/bot';
import { CELEBRITY_BOTS } from '../data/celebrityBots';
import { TIME_CONTROLS } from '../data/timeControls';
import { onlineChannel, OnlineMessage } from '../utils/onlineService';
import {
  MIN_ELO,
  MAX_ELO,
  clampElo,
  ELO_TIERS,
  getUserEloProfile,
  saveUserEloProfile,
  calculateEloChange,
  evaluatePlayerPerformance
} from '../utils/eloEngine';

interface ChessGameProps {
  selectedBotToPlay?: string | null;
  onBotClear?: () => void;
}

export const ChessGame: React.FC<ChessGameProps> = ({
  selectedBotToPlay,
  onBotClear
}) => {
  // Chess engine instance
  const [chess] = useState(() => new Chess());
  const [boardState, setBoardState] = useState(chess.board());
  const [turn, setTurn] = useState<'w' | 'b'>('w');
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isBotThinking, setIsBotThinking] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Eye-friendly board theme: 'emerald' | 'wood' | 'slate' | 'sand'
  const [boardTheme, setBoardTheme] = useState<BoardTheme>('emerald');

  // Game Mode: 'ranked' | 'casual' | 'online'
  const [gameMode, setGameMode] = useState<GameMode>('ranked');
  const [botElo, setBotElo] = useState<number>(1200);
  const [userProfile, setUserProfile] = useState<UserEloProfile>(() => getUserEloProfile());

  // Celebrity Bot selection
  const [selectedCelebrityBot, setSelectedCelebrityBot] = useState<CelebrityBot | null>(null);
  const [isCelebrityModalOpen, setIsCelebrityModalOpen] = useState(false);
  const [botDialogue, setBotDialogue] = useState<string | null>(null);

  // Online Multiplayer State
  const [isOnlineModalOpen, setIsOnlineModalOpen] = useState(false);
  const [onlineOpponent, setOnlineOpponent] = useState<OnlinePlayerInfo | null>(null);
  const [onlineRoomId, setOnlineRoomId] = useState<string | null>(null);
  const [playerColor, setPlayerColor] = useState<'w' | 'b'>('w');
  const [onlineChatMessages, setOnlineChatMessages] = useState<{ sender: string; text: string; isMe: boolean }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Time Controls & Clocks
  const [selectedTimeControl, setSelectedTimeControl] = useState<TimeControlOption>(
    TIME_CONTROLS.find((tc) => tc.id === 'rapid-10-0') || TIME_CONTROLS[7]
  );
  const [whiteTime, setWhiteTime] = useState<number>(600);
  const [blackTime, setBlackTime] = useState<number>(600);
  const [isClockRunning, setIsClockRunning] = useState<boolean>(false);

  // Player move quality tracking (for dynamic accuracy and ELO assessment)
  const [playerMovesWithLoss, setPlayerMovesWithLoss] = useState<{ san: string; evalLoss?: number }[]>([]);

  // Post-game ELO result data
  const [eloResultData, setEloResultData] = useState<{
    oldElo: number;
    newElo: number;
    eloChange: number;
  } | null>(null);

  // Board interaction states
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [validMoves, setValidMoves] = useState<Square[]>([]);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);
  const [history, setHistory] = useState<MoveHistoryItem[]>([]);
  const [checkSquare, setCheckSquare] = useState<Square | null>(null);
  const [gameResult, setGameResult] = useState<{
    title: string;
    description: string;
    winner: 'w' | 'b' | 'draw' | null;
  } | null>(null);

  // Promotion handling
  const [pendingPromotion, setPendingPromotion] = useState<{ from: Square; to: Square } | null>(null);

  // Hint suggestion
  const [hintMove, setHintMove] = useState<{ from: Square; to: Square } | null>(null);
  const [copiedFen, setCopiedFen] = useState(false);

  const movesContainerRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // External trigger when a user challenges a bot from the Top 100 Leaderboard
  useEffect(() => {
    if (selectedBotToPlay) {
      const found = CELEBRITY_BOTS.find((b) => b.id === selectedBotToPlay);
      if (found) {
        handleSelectCelebrityBot(found);
      }
      if (onBotClear) onBotClear();
    }
  }, [selectedBotToPlay]);

  // Auto-scroll moves container
  useEffect(() => {
    if (movesContainerRef.current) {
      movesContainerRef.current.scrollTop = movesContainerRef.current.scrollHeight;
    }
  }, [history]);

  // Auto-scroll chat container
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [onlineChatMessages]);

  // Current bot tier info
  const currentBotTier = useMemo(() => {
    const sorted = [...ELO_TIERS].sort((a, b) => Math.abs(a.elo - botElo) - Math.abs(b.elo - botElo));
    return sorted[0] || ELO_TIERS[2];
  }, [botElo]);

  // Dynamic Player Performance & Opening Analysis
  const dynamicAnalysis = useMemo(() => {
    const allSans = history.map((h) => h.san);
    return evaluatePlayerPerformance(playerMovesWithLoss, allSans, botElo);
  }, [playerMovesWithLoss, history, botElo]);

  // Check checkSquare
  const updateCheckSquare = useCallback(() => {
    if (chess.inCheck()) {
      const currentTurn = chess.turn();
      const b = chess.board();
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const piece = b[r][c];
          if (piece && piece.type === 'k' && piece.color === currentTurn) {
            setCheckSquare(piece.square);
            chessAudio.playCheck();
            return;
          }
        }
      }
    } else {
      setCheckSquare(null);
    }
  }, [chess]);

  // Reset clocks based on current time control
  const resetClocks = useCallback((tc: TimeControlOption) => {
    setWhiteTime(tc.initialSeconds);
    setBlackTime(tc.initialSeconds);
    setIsClockRunning(false);
  }, []);

  // Timer countdown loop
  useEffect(() => {
    if (!isClockRunning || gameResult || selectedTimeControl.initialSeconds === 0) {
      return;
    }

    const interval = setInterval(() => {
      if (turn === 'w') {
        setWhiteTime((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            // Black wins on time
            handleTimeOut('w');
            return 0;
          }
          return prev - 1;
        });
      } else {
        setBlackTime((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            // White wins on time
            handleTimeOut('b');
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isClockRunning, turn, gameResult, selectedTimeControl]);

  // Handle Timeout (Flag fall)
  const handleTimeOut = (flaggedColor: 'w' | 'b') => {
    const winner = flaggedColor === 'w' ? 'b' : 'w';
    const isUserWinner = winner === playerColor;

    finalizeGame(
      winner,
      'Vaqt Tugadi!',
      flaggedColor === 'w'
        ? "Oqlarning vaqti tugadi. Qoralar vaqt bo'yicha g'alaba qozondi!"
        : "Qoralarning vaqti tugadi. Oqlar vaqt bo'yicha g'alaba qozondi!"
    );
  };

  // Finalize match & calculate ELO
  const finalizeGame = useCallback(
    (winner: 'w' | 'b' | 'draw', title: string, description: string) => {
      setIsClockRunning(false);
      const isUserWinner = winner === playerColor;

      if (isUserWinner) {
        chessAudio.playVictory();
        confetti({
          particleCount: 140,
          spread: 85,
          origin: { y: 0.6 }
        });
      }

      setGameResult({
        title,
        description,
        winner
      });

      // Show celebrity bot quote
      if (selectedCelebrityBot) {
        if (isUserWinner) {
          setBotDialogue(selectedCelebrityBot.lossQuote);
        } else if (winner !== 'draw') {
          setBotDialogue(selectedCelebrityBot.winQuote);
        }
      }

      const activeOpponentElo = gameMode === 'online' && onlineOpponent ? onlineOpponent.elo : botElo;

      if (gameMode === 'ranked' || gameMode === 'online') {
        const matchResult = isUserWinner ? 'win' : winner === 'draw' ? 'draw' : 'loss';
        const { eloChange, newElo } = calculateEloChange(userProfile.currentElo, activeOpponentElo, matchResult);

        setEloResultData({
          oldElo: userProfile.currentElo,
          newElo,
          eloChange
        });

        const updatedProfile: UserEloProfile = {
          ...userProfile,
          currentElo: newElo,
          highestElo: Math.max(userProfile.highestElo, newElo),
          lowestElo: Math.min(userProfile.lowestElo, newElo),
          gamesPlayed: userProfile.gamesPlayed + 1,
          wins: userProfile.wins + (isUserWinner ? 1 : 0),
          losses: userProfile.losses + (!isUserWinner && winner !== 'draw' ? 1 : 0),
          draws: userProfile.draws + (winner === 'draw' ? 1 : 0),
          history: [
            {
              id: Date.now().toString(),
              date: new Date().toLocaleDateString('uz-UZ'),
              opponentElo: activeOpponentElo,
              opponentName: selectedCelebrityBot ? selectedCelebrityBot.name : onlineOpponent ? onlineOpponent.name : undefined,
              result: matchResult,
              eloChange,
              newElo,
              accuracy: dynamicAnalysis.overallAccuracy,
              openingName: dynamicAnalysis.opening ? dynamicAnalysis.opening.nameUz : "Erkin o'yin",
              timeControl: selectedTimeControl.badge
            },
            ...userProfile.history.slice(0, 19)
          ]
        };

        setUserProfile(updatedProfile);
        saveUserEloProfile(updatedProfile);
      } else {
        setEloResultData(null);
      }
    },
    [gameMode, userProfile, botElo, onlineOpponent, selectedCelebrityBot, dynamicAnalysis, selectedTimeControl, playerColor]
  );

  // Evaluate game end conditions
  const evaluateGameEnd = useCallback(() => {
    if (chess.isCheckmate()) {
      const winner = chess.turn() === 'w' ? 'b' : 'w';
      const isUserWinner = winner === playerColor;
      finalizeGame(
        winner,
        'Shax va Mat!',
        isUserWinner
          ? `Qoyilmaqom g'alaba! Siz raqibingizni mot qildingiz!`
          : `Mot bo'ldingiz! Raqibingiz g'alaba qozondi.`
      );
      return true;
    }

    if (chess.isDraw()) {
      let reason = 'Durang!';
      if (chess.isStalemate()) reason = "Pat (yurish imkoniyati yo'q, ammo shax emas)";
      else if (chess.isThreefoldRepetition()) reason = 'Uch marta takrorlangan pozitsiya';
      else if (chess.isInsufficientMaterial()) reason = "Mot qilish uchun donalar yetarli emas";

      finalizeGame('draw', 'Durang!', reason);
      return true;
    }

    return false;
  }, [chess, playerColor, finalizeGame]);

  // Execute a move on the board
  const makeMove = useCallback(
    (from: Square, to: Square, promotionPiece?: string, isRemoteMove: boolean = false) => {
      try {
        const isHumanMove = chess.turn() === playerColor;
        const currentMover = chess.turn();
        const evalBefore = evaluateBoard(chess);

        const move = chess.move({
          from,
          to,
          promotion: promotionPiece || 'q'
        });

        if (move) {
          if (move.captured) {
            chessAudio.playCapture();
            if (selectedCelebrityBot && currentMover !== playerColor && Math.random() < 0.4) {
              setBotDialogue(selectedCelebrityBot.captureQuote);
            }
          } else {
            chessAudio.playMove();
          }

          // Centipawn loss analysis for human player
          if (isHumanMove && !isRemoteMove) {
            const evalAfter = evaluateBoard(chess);
            const evalDiff = playerColor === 'w'
              ? Math.max(0, evalBefore - evalAfter)
              : Math.max(0, evalAfter - evalBefore);
            setPlayerMovesWithLoss((prev) => [...prev, { san: move.san, evalLoss: evalDiff }]);
          }

          // Broadcast move if in Online Room mode
          if (gameMode === 'online' && onlineRoomId && !isRemoteMove) {
            onlineChannel.send('move', onlineRoomId, {
              from,
              to,
              promotion: promotionPiece,
              san: move.san
            });
          }

          // Add increment to time if clock has increment
          if (selectedTimeControl.incrementSeconds > 0 && selectedTimeControl.initialSeconds > 0) {
            if (currentMover === 'w') {
              setWhiteTime((prev) => prev + selectedTimeControl.incrementSeconds);
            } else {
              setBlackTime((prev) => prev + selectedTimeControl.incrementSeconds);
            }
          }

          // Start clocks on first move
          if (!isClockRunning && selectedTimeControl.initialSeconds > 0) {
            setIsClockRunning(true);
          }

          setBoardState(chess.board());
          setTurn(chess.turn());
          setLastMove({ from: move.from, to: move.to });
          setHintMove(null);

          const historyItem: MoveHistoryItem = {
            san: move.san,
            from: move.from,
            to: move.to,
            piece: move.piece,
            color: move.color,
            captured: move.captured,
            promotion: move.promotion
          };
          setHistory((prev) => [...prev, historyItem]);

          setSelectedSquare(null);
          setValidMoves([]);
          updateCheckSquare();

          const isOver = evaluateGameEnd();
          return { success: true, isOver };
        }
      } catch {
        return { success: false, isOver: false };
      }
      return { success: false, isOver: false };
    },
    [chess, playerColor, gameMode, onlineRoomId, selectedTimeControl, isClockRunning, selectedCelebrityBot, evaluateGameEnd, updateCheckSquare]
  );

  // Online BroadcastChannel listener for P2P cross-tab / cross-window sync
  useEffect(() => {
    if (gameMode !== 'online' || !onlineRoomId) return;

    const unsubscribe = onlineChannel.subscribe((msg: OnlineMessage) => {
      if (msg.roomId !== onlineRoomId) return;

      if (msg.type === 'move' && msg.payload) {
        const { from, to, promotion } = msg.payload;
        makeMove(from, to, promotion, true);
      } else if (msg.type === 'chat' && msg.payload) {
        setOnlineChatMessages((prev) => [
          ...prev,
          { sender: onlineOpponent ? onlineOpponent.name : 'Raqib', text: msg.payload.text, isMe: false }
        ]);
      } else if (msg.type === 'resign') {
        finalizeGame(playerColor, "Raqib Taslim Bo'ldi!", "Raqibingiz o'yinni tark etdi va taslim bo'ldi.");
      }
    });

    return () => unsubscribe();
  }, [gameMode, onlineRoomId, playerColor, onlineOpponent, makeMove, finalizeGame]);

  // Simulated Global Opponent Move Loop (when playing random online match)
  useEffect(() => {
    const isOpponentTurn = turn !== playerColor;
    if (gameMode === 'online' && isOpponentTurn && !gameResult && !pendingPromotion && onlineOpponent) {
      setIsBotThinking(true);

      // Human-like thinking time: 2 to 4.5 seconds
      const thinkingTime = Math.floor(1800 + Math.random() * 2400);

      const timer = setTimeout(() => {
        const opponentMove = getBotMove(chess, onlineOpponent.elo);
        if (opponentMove) {
          makeMove(opponentMove.from, opponentMove.to, opponentMove.promotion, true);

          // 15% chance for opponent to send friendly quick emoji
          if (Math.random() < 0.15) {
            const emojis = ['👍', '🔥', '👏', '🤝', '⚡'];
            const chosen = emojis[Math.floor(Math.random() * emojis.length)];
            setOnlineChatMessages((prev) => [
              ...prev,
              { sender: onlineOpponent.name, text: chosen, isMe: false }
            ]);
          }
        }
        setIsBotThinking(false);
      }, thinkingTime);

      return () => clearTimeout(timer);
    }
  }, [turn, playerColor, gameMode, gameResult, pendingPromotion, onlineOpponent, chess, makeMove]);

  // Offline / Ranked Bot Response Loop
  useEffect(() => {
    const isBotTurn = turn === 'b' && playerColor === 'w';
    if (gameMode !== 'online' && isBotTurn && !gameResult && !pendingPromotion) {
      setIsBotThinking(true);

      const delay = botElo >= 2800 ? 600 : botElo >= 1600 ? 450 : 320;

      const timer = setTimeout(() => {
        const botMove = getBotMove(chess, botElo, selectedCelebrityBot ? selectedCelebrityBot.id : undefined);
        if (botMove) {
          makeMove(botMove.from, botMove.to, botMove.promotion);
        }
        setIsBotThinking(false);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [turn, playerColor, gameMode, gameResult, pendingPromotion, chess, botElo, selectedCelebrityBot, makeMove]);

  // Handle Board Square Click
  const handleSquareClick = (square: Square) => {
    if (turn !== playerColor || isBotThinking || gameResult) return;

    if (selectedSquare === square) {
      setSelectedSquare(null);
      setValidMoves([]);
      return;
    }

    if (selectedSquare && validMoves.includes(square)) {
      const piece = chess.get(selectedSquare);
      // Pawn promotion check
      if (
        piece &&
        piece.type === 'p' &&
        piece.color === playerColor &&
        ((playerColor === 'w' && square[1] === '8') || (playerColor === 'b' && square[1] === '1'))
      ) {
        setPendingPromotion({ from: selectedSquare, to: square });
        return;
      }

      makeMove(selectedSquare, square);
      return;
    }

    const piece = chess.get(square);
    if (piece && piece.color === playerColor) {
      setSelectedSquare(square);
      const legalMoves = chess.moves({ square, verbose: true }) as Move[];
      setValidMoves(legalMoves.map((m) => m.to));
    } else {
      setSelectedSquare(null);
      setValidMoves([]);
    }
  };

  // Drag and drop handler
  const handlePieceDrop = (from: Square, to: Square) => {
    if (turn !== playerColor || isBotThinking || gameResult) return;

    const piece = chess.get(from);
    if (!piece || piece.color !== playerColor) return;

    // Pawn promotion check
    if (
      piece.type === 'p' &&
      ((playerColor === 'w' && to[1] === '8') || (playerColor === 'b' && to[1] === '1'))
    ) {
      const legalMoves = chess.moves({ square: from, verbose: true }) as Move[];
      if (legalMoves.some((m) => m.to === to)) {
        setPendingPromotion({ from, to });
        return;
      }
    }

    makeMove(from, to);
  };

  // Pawn Promotion selection
  const handlePromotionSelect = (promotionPiece: string) => {
    if (pendingPromotion) {
      makeMove(pendingPromotion.from, pendingPromotion.to, promotionPiece);
      setPendingPromotion(null);
    }
  };

  // Reset Game
  const handleReset = () => {
    chess.reset();
    setBoardState(chess.board());
    setTurn('w');
    setSelectedSquare(null);
    setValidMoves([]);
    setLastMove(null);
    setHistory([]);
    setPlayerMovesWithLoss([]);
    setCheckSquare(null);
    setGameResult(null);
    setEloResultData(null);
    setPendingPromotion(null);
    setHintMove(null);
    setIsBotThinking(false);
    resetClocks(selectedTimeControl);

    if (selectedCelebrityBot) {
      setBotDialogue(selectedCelebrityBot.greeting);
    } else {
      setBotDialogue(null);
    }
  };

  // Handle selecting a Grandmaster Bot
  const handleSelectCelebrityBot = (bot: CelebrityBot) => {
    setSelectedCelebrityBot(bot);
    setBotElo(bot.elo);
    setGameMode('ranked');
    setPlayerColor('w');
    setIsFlipped(false);
    handleReset();
    setBotDialogue(bot.greeting);

    // Smooth scroll to board
    const el = document.getElementById('game-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle starting an Online match
  const handleStartOnlineMatch = (
    opponent: OnlinePlayerInfo,
    assignedColor: 'w' | 'b',
    tc: TimeControlOption,
    roomId: string
  ) => {
    setOnlineOpponent(opponent);
    setPlayerColor(assignedColor);
    setIsFlipped(assignedColor === 'b');
    setSelectedTimeControl(tc);
    setGameMode('online');
    setOnlineRoomId(roomId);
    setSelectedCelebrityBot(null);
    setOnlineChatMessages([
      { sender: 'Tizim', text: `Raqib topildi: ${opponent.name} (${opponent.elo} ELO). O'yin boshlandi!`, isMe: false }
    ]);
    handleReset();
    resetClocks(tc);
  };

  // Send Chat Message
  const handleSendChatMessage = (textToSend?: string) => {
    const text = textToSend || chatInput.trim();
    if (!text) return;

    setOnlineChatMessages((prev) => [...prev, { sender: 'Siz', text, isMe: true }]);
    setChatInput('');
    setShowEmojiPicker(false);

    if (onlineRoomId) {
      onlineChannel.send('chat', onlineRoomId, { text });
    }
  };

  // Undo move (casual only)
  const handleUndo = () => {
    if (isBotThinking || history.length === 0 || gameMode !== 'casual') return;

    if (turn === playerColor) {
      chess.undo();
      chess.undo();
      setHistory((prev) => prev.slice(0, -2));
      setPlayerMovesWithLoss((prev) => prev.slice(0, -1));
    } else {
      chess.undo();
      setHistory((prev) => prev.slice(0, -1));
      setPlayerMovesWithLoss((prev) => prev.slice(0, -1));
    }

    setBoardState(chess.board());
    setTurn(chess.turn());
    setSelectedSquare(null);
    setValidMoves([]);
    setGameResult(null);
    setEloResultData(null);
    setHintMove(null);
    updateCheckSquare();

    const moves = chess.history({ verbose: true });
    if (moves.length > 0) {
      const last = moves[moves.length - 1];
      setLastMove({ from: last.from, to: last.to });
    } else {
      setLastMove(null);
    }
  };

  // Get Move Hint
  const handleGetHint = () => {
    if (turn !== playerColor || isBotThinking || gameResult || gameMode !== 'casual') return;
    const bestMove = getBotMove(chess, 3200);
    if (bestMove) {
      setHintMove({ from: bestMove.from, to: bestMove.to });
    }
  };

  // Toggle audio
  const toggleSound = () => {
    const muted = chessAudio.toggleMute();
    setIsMuted(muted);
  };

  // Copy FEN
  const handleCopyFen = () => {
    const fen = chess.fen();
    navigator.clipboard.writeText(fen);
    setCopiedFen(true);
    setTimeout(() => setCopiedFen(false), 2000);
  };

  // Cycle board theme
  const cycleBoardTheme = () => {
    const themes: BoardTheme[] = ['emerald', 'wood', 'slate', 'sand'];
    const nextIdx = (themes.indexOf(boardTheme) + 1) % themes.length;
    setBoardTheme(themes[nextIdx]);
  };

  // Captured pieces
  const capturedWhitePieces = history
    .filter((h) => h.color === 'b' && h.captured)
    .map((h) => h.captured as string);

  const capturedBlackPieces = history
    .filter((h) => h.color === 'w' && h.captured)
    .map((h) => h.captured as string);

  const pieceScores: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9 };
  const whiteScore = capturedBlackPieces.reduce((acc, p) => acc + (pieceScores[p] || 0), 0);
  const blackScore = capturedWhitePieces.reduce((acc, p) => acc + (pieceScores[p] || 0), 0);
  const materialAdvantage = whiteScore - blackScore;

  // Active opponent display values
  const activeOpponentName = selectedCelebrityBot
    ? selectedCelebrityBot.name
    : gameMode === 'online' && onlineOpponent
    ? onlineOpponent.name
    : `Chess Bot (${currentBotTier.titleUz})`;

  const activeOpponentElo = selectedCelebrityBot
    ? selectedCelebrityBot.elo
    : gameMode === 'online' && onlineOpponent
    ? onlineOpponent.elo
    : botElo;

  const activeOpponentAvatar = selectedCelebrityBot
    ? selectedCelebrityBot.avatarUrl
    : gameMode === 'online' && onlineOpponent
    ? onlineOpponent.avatarUrl
    : undefined;

  const activeOpponentFlag = selectedCelebrityBot
    ? selectedCelebrityBot.flag
    : gameMode === 'online' && onlineOpponent
    ? onlineOpponent.flag
    : undefined;

  return (
    <section id="game-section" className="relative py-6 lg:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Background radial accent with eye-pleasing soft sage tones */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-emerald-600/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Banner: Quick Mode Selectors & Celebrity Bots Trigger */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2">
          {/* Celebrity Bots Modal Trigger Button */}
          <button
            id="open-celebrity-modal-btn"
            onClick={() => setIsCelebrityModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <Crown className="w-4 h-4 fill-current" />
            <span>TOP 10 Grossmeyster Botlari</span>
          </button>

          {/* Online Matchmaking Trigger Button */}
          <button
            id="open-online-modal-btn"
            onClick={() => setIsOnlineModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95"
          >
            <Globe className="w-4 h-4 animate-pulse" />
            <span>Dunyo Bo'ylab Onlayn O'yin</span>
          </button>
        </div>

        {/* Time Control Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 hidden sm:inline flex items-center gap-1">
            <Timer className="w-3.5 h-3.5 text-emerald-400" />
            Vaqt:
          </span>
          <select
            id="time-control-select"
            value={selectedTimeControl.id}
            onChange={(e) => {
              const tc = TIME_CONTROLS.find((t) => t.id === e.target.value);
              if (tc) {
                setSelectedTimeControl(tc);
                resetClocks(tc);
              }
            }}
            className="py-1.5 px-3 rounded-xl bg-slate-950 text-slate-200 border border-slate-800 text-xs font-semibold focus:border-emerald-500 focus:outline-none"
          >
            {TIME_CONTROLS.map((tc) => (
              <option key={tc.id} value={tc.id}>
                {tc.name} ({tc.badge})
              </option>
            ))}
          </select>

          {/* Theme Cycler */}
          <button
            id="toggle-board-theme-btn"
            onClick={cycleBoardTheme}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700 text-xs flex items-center gap-1.5"
            title="Taxta mavzusini almashtirish (Krem, Yog'och, Moviy, Qumloq)"
          >
            <Palette className="w-4 h-4 text-emerald-400" />
            <span className="capitalize text-[11px] font-semibold hidden md:inline">{boardTheme}</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Game Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Game Mode, Player Profiles & ELO Bot Controls */}
        <div className="lg:col-span-3 space-y-4 order-2 lg:order-1">
          {/* Game Mode Switcher: Ranked vs Casual vs Online */}
          <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-800 shadow-lg backdrop-blur-sm">
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-[11px]">
              <button
                id="btn-mode-ranked"
                onClick={() => {
                  setGameMode('ranked');
                  setSelectedCelebrityBot(null);
                  setOnlineOpponent(null);
                }}
                className={`flex items-center justify-center gap-1 py-2 px-2 rounded-lg font-bold transition-all truncate ${
                  gameMode === 'ranked' && !selectedCelebrityBot
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Trophy className="w-3 h-3" />
                <span>Darajali</span>
              </button>

              <button
                id="btn-mode-casual"
                onClick={() => {
                  setGameMode('casual');
                  setSelectedCelebrityBot(null);
                  setOnlineOpponent(null);
                }}
                className={`flex items-center justify-center gap-1 py-2 px-2 rounded-lg font-bold transition-all truncate ${
                  gameMode === 'casual'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <GraduationCap className="w-3 h-3" />
                <span>Erkin</span>
              </button>

              <button
                id="btn-mode-online"
                onClick={() => setIsOnlineModalOpen(true)}
                className={`flex items-center justify-center gap-1 py-2 px-2 rounded-lg font-bold transition-all truncate ${
                  gameMode === 'online'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Globe className="w-3 h-3" />
                <span>Onlayn</span>
              </button>
            </div>

            <p className="text-[10px] text-slate-400 mt-2 text-center px-1">
              {gameMode === 'ranked'
                ? "⭐ Rasmiy ELO reytingingiz yangilanadi. Haqiqiy sun'iy intellekt hisobi."
                : gameMode === 'online'
                ? "🌐 Internet orqali butun dunyo shaxmatchilari bilan jonli bellashuv!"
                : "🎓 Erkin o'yin: maslahat va qaytarishdan bemalol foydalaning."}
            </p>
          </div>

          {/* User Profile Card */}
          <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 shadow-lg relative overflow-hidden backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500/20 to-emerald-500/20 flex items-center justify-center border border-amber-500/30 text-amber-300">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">
                      Siz ({playerColor === 'w' ? 'Oqlar' : 'Qoralar'})
                    </span>
                    {turn === playerColor && !gameResult && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-bold font-mono text-amber-400">
                      {userProfile.currentElo} ELO
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ({userProfile.wins}G' / {userProfile.losses}M)
                    </span>
                  </div>
                </div>
              </div>

              {/* User Captured Pieces */}
              <div className="text-right">
                <div className="flex items-center gap-0.5 max-w-[90px] overflow-x-auto justify-end">
                  {(playerColor === 'w' ? capturedBlackPieces : capturedWhitePieces).slice(0, 5).map((p, i) => (
                    <div key={i} className="w-4 h-4 opacity-85">
                      <ChessPiece type={p} color={playerColor === 'w' ? 'b' : 'w'} />
                    </div>
                  ))}
                </div>
                {materialAdvantage > 0 && (
                  <span className="text-[11px] font-bold text-emerald-400 font-mono">
                    +{materialAdvantage}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Opponent Card (Celebrity Bot / Online Opponent / Standard Bot) */}
          <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 shadow-lg relative overflow-hidden backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {activeOpponentAvatar ? (
                    <img
                      src={activeOpponentAvatar}
                      alt={activeOpponentName}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-xl object-cover border border-slate-700 shadow-sm"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center border border-slate-700 text-slate-300">
                      <Bot className="w-6 h-6 text-emerald-400" />
                    </div>
                  )}
                  {activeOpponentFlag && (
                    <span className="absolute -bottom-1 -right-1 text-xs">{activeOpponentFlag}</span>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm truncate max-w-[130px]">
                      {activeOpponentName}
                    </span>
                    {isBotThinking && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 animate-pulse font-mono font-semibold">
                        O'ylamoqda...
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs font-bold font-mono text-cyan-400">
                      {activeOpponentElo} ELO
                    </span>
                    {selectedCelebrityBot && (
                      <span className="text-[10px] text-amber-400 font-semibold truncate max-w-[110px]">
                        {selectedCelebrityBot.title}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bot Captured Pieces */}
              <div className="text-right">
                <div className="flex items-center gap-0.5 max-w-[90px] overflow-x-auto justify-end">
                  {(playerColor === 'w' ? capturedWhitePieces : capturedBlackPieces).slice(0, 5).map((p, i) => (
                    <div key={i} className="w-4 h-4 opacity-85">
                      <ChessPiece type={p} color={playerColor} />
                    </div>
                  ))}
                </div>
                {materialAdvantage < 0 && (
                  <span className="text-[11px] font-bold text-emerald-400 font-mono">
                    +{Math.abs(materialAdvantage)}
                  </span>
                )}
              </div>
            </div>

            {/* In-Game Dialogue Bubble for Celebrity Bot */}
            {botDialogue && selectedCelebrityBot && (
              <div className="mt-3 p-2.5 rounded-xl bg-slate-950/80 border border-amber-500/30 text-amber-300 text-xs italic flex items-start gap-2 animate-fade-in">
                <MessageSquare className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-snug">"{botDialogue}"</span>
              </div>
            )}
          </div>

          {/* Bot ELO Slider (when in bot mode) */}
          {gameMode !== 'online' && !selectedCelebrityBot && (
            <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 backdrop-blur-sm space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  <span>Raqib ELO Darajasi</span>
                </label>
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 font-mono font-black text-xs text-amber-400">
                  <span>{botElo}</span>
                  <span className="text-[10px] text-slate-500">ELO</span>
                </div>
              </div>

              {/* Slider 300 to 3200 */}
              <div className="space-y-1">
                <input
                  id="bot-elo-slider"
                  type="range"
                  min={MIN_ELO}
                  max={MAX_ELO}
                  step={50}
                  value={botElo}
                  onChange={(e) => setBotElo(clampElo(Number(e.target.value)))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 px-0.5">
                  <span>300 (Min)</span>
                  <span>1200 (Haqiqiy)</span>
                  <span>3200 (Daho)</span>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                {[
                  { elo: 400, label: "400 Bosh." },
                  { elo: 800, label: "800 Hav." },
                  { elo: 1200, label: "1200 O'rta" },
                  { elo: 1600, label: "1600 Klub" },
                  { elo: 2000, label: "2000 CM" },
                  { elo: 2400, label: "2400 IM" },
                  { elo: 2800, label: "2800 GM" },
                  { elo: 3200, label: "3200 Daho" }
                ].map((tier) => (
                  <button
                    key={tier.elo}
                    id={`btn-elo-${tier.elo}`}
                    onClick={() => setBotElo(tier.elo)}
                    className={`py-1.5 px-1 rounded-lg text-[10px] font-bold transition-all truncate text-center ${
                      botElo === tier.elo
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 shadow'
                        : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/80'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>

              <p className="text-[11px] text-slate-400 leading-snug">
                {currentBotTier.description}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              id="btn-undo"
              onClick={handleUndo}
              disabled={isBotThinking || history.length === 0 || gameMode !== 'casual'}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
              title={gameMode !== 'casual' ? "Faqat erkin mashg'ulot rejimida qaytarish mumkin" : "Oxirgi yurishni qaytarish"}
            >
              <Undo2 className="w-4 h-4 text-amber-400" />
              <span>Qaytarish</span>
            </button>

            <button
              id="btn-reset"
              onClick={handleReset}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
              title="Yangi o'yin boshlash"
            >
              <RotateCcw className="w-4 h-4 text-emerald-400" />
              <span>Yangilash</span>
            </button>

            <button
              id="btn-hint"
              onClick={handleGetHint}
              disabled={turn !== playerColor || isBotThinking || !!gameResult || gameMode !== 'casual'}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
              title={gameMode !== 'casual' ? "Darajali o'yinda maslahat o'chirilgan" : "Eng yaxshi yurish tavsiyasi"}
            >
              <Lightbulb className="w-4 h-4 text-yellow-300" />
              <span>Maslahat</span>
            </button>

            <button
              id="btn-flip"
              onClick={() => setIsFlipped(!isFlipped)}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
              title="Taxtani aylantirish"
            >
              <RotateCw className="w-4 h-4 text-sky-400" />
              <span>Aylantirish</span>
            </button>
          </div>

          {/* Sound & FEN toolbar */}
          <div className="flex items-center justify-between px-2 pt-1 text-slate-400">
            <button
              id="btn-sound-toggle"
              onClick={toggleSound}
              className="flex items-center gap-1.5 text-xs hover:text-white transition"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              <span>{isMuted ? "Ovoz: O'chiq" : 'Ovoz: Yoniq'}</span>
            </button>

            <button
              id="btn-copy-fen"
              onClick={handleCopyFen}
              className="flex items-center gap-1 text-xs hover:text-white transition"
              title="Pozitsiya FEN kodini nusxalash"
            >
              {copiedFen ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedFen ? 'Nusxalandi!' : 'FEN'}</span>
            </button>
          </div>
        </div>

        {/* Center Column: The Clock & The Chessboard */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center order-1 lg:order-2">
          {/* Dual Digital Chess Clock */}
          <div className="w-full max-w-[540px] mb-3">
            <ChessClock
              whiteTime={whiteTime}
              blackTime={blackTime}
              activeColor={turn}
              isUnlimited={selectedTimeControl.initialSeconds === 0}
              whiteName={playerColor === 'w' ? 'Siz' : activeOpponentName}
              blackName={playerColor === 'b' ? 'Siz' : activeOpponentName}
              whiteElo={playerColor === 'w' ? userProfile.currentElo : activeOpponentElo}
              blackElo={playerColor === 'b' ? userProfile.currentElo : activeOpponentElo}
              whiteAvatar={playerColor === 'w' ? undefined : activeOpponentAvatar}
              blackAvatar={playerColor === 'b' ? undefined : activeOpponentAvatar}
              whiteFlag={playerColor === 'w' ? '🇺🇿' : activeOpponentFlag}
              blackFlag={playerColor === 'b' ? '🇺🇿' : activeOpponentFlag}
              isGameOver={Boolean(gameResult)}
            />
          </div>

          {/* Status Bar */}
          <div className="w-full max-w-[540px] min-h-[40px] mb-2.5 flex items-center justify-center">
            {chess.inCheck() && !gameResult ? (
              <div className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-sm font-bold animate-pulse shadow-lg">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{turn === playerColor ? "Diqqat! Shohingizga shax e'lon qilindi!" : "Raqib shohiga shax e'lon qilindi!"}</span>
              </div>
            ) : hintMove ? (
              <div className="w-full flex items-center justify-between py-2 px-4 rounded-xl bg-yellow-500/15 border border-yellow-500/30 text-yellow-300 text-xs font-semibold shadow">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                  <span>Tavsiya etilgan yurish: <strong className="font-mono text-white">{hintMove.from} ➔ {hintMove.to}</strong></span>
                </div>
                <button onClick={() => setHintMove(null)} className="text-yellow-400 hover:text-white text-xs">
                  Yopish
                </button>
              </div>
            ) : (
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  {turn === playerColor
                    ? `Sizning navbatingiz (${playerColor === 'w' ? 'Oqlar' : 'Qoralar'})`
                    : `${activeOpponentName} yurishi kutilmoqda...`}
                </span>
              </div>
            )}
          </div>

          {/* The Board with selected theme */}
          <Board
            board={boardState}
            turn={turn}
            isFlipped={isFlipped}
            selectedSquare={selectedSquare}
            validMoves={validMoves}
            lastMove={lastMove}
            checkSquare={checkSquare}
            onSquareClick={handleSquareClick}
            onPieceDrop={handlePieceDrop}
            isInteractive={turn === playerColor && !isBotThinking && !gameResult}
            theme={boardTheme}
          />
        </div>

        {/* Right Column: ELO Evaluation, Move History, or Online Chat */}
        <div className="lg:col-span-3 space-y-4 order-3">
          {/* Live Dynamic ELO & Opening Analysis Panel */}
          <EloAnalysisPanel
            analysis={dynamicAnalysis}
            moveCount={playerMovesWithLoss.length}
          />

          {/* Move History / Notation Panel */}
          <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 shadow-lg flex flex-col h-[280px] lg:h-[300px] backdrop-blur-sm">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Yurishlar Notatsiyasi
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {Math.ceil(history.length / 2)} yurish
              </span>
            </div>

            {/* Scrollable moves list */}
            <div ref={movesContainerRef} className="flex-1 overflow-y-auto py-2 pr-1 space-y-1 text-xs font-mono">
              {history.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-500">
                  <div className="w-8 h-8 rounded-full bg-slate-800/50 flex items-center justify-center mb-1.5">
                    <Swords className="w-4 h-4 text-slate-600" />
                  </div>
                  <p className="text-xs">O'yin hali boshlanmadi.</p>
                  <p className="text-[10px] text-slate-600 mt-0.5">Birinchi yurishni bajaring!</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-800/50">
                  {Array.from({ length: Math.ceil(history.length / 2) }).map((_, i) => {
                    const whiteMove = history[i * 2];
                    const blackMove = history[i * 2 + 1];
                    const moveNum = i + 1;

                    return (
                      <div key={i} className="grid grid-cols-12 py-1 px-2 rounded hover:bg-slate-800/50 transition">
                        <span className="col-span-2 text-slate-500 font-semibold">{moveNum}.</span>
                        <span className="col-span-5 text-slate-200 font-bold flex items-center gap-1">
                          {whiteMove.san}
                          {whiteMove.captured && <span className="text-rose-400 text-[10px]">x</span>}
                        </span>
                        <span className="col-span-5 text-slate-400 flex items-center gap-1">
                          {blackMove ? (
                            <>
                              {blackMove.san}
                              {blackMove.captured && <span className="text-rose-400 text-[10px]">x</span>}
                            </>
                          ) : (
                            <span className="text-slate-600">...</span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Game status footer */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Rejim:</span>
              <span className="font-semibold text-amber-400">
                {gameMode === 'ranked' ? 'Darajali O\'yin' : gameMode === 'online' ? 'Onlayn Arena' : 'Mashg\'ulot'}
              </span>
            </div>
          </div>

          {/* Online Match Chat Widget (when in online mode) */}
          {gameMode === 'online' && (
            <div className="bg-slate-900/80 rounded-2xl p-3 border border-slate-800 shadow-lg flex flex-col h-[200px] backdrop-blur-sm">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-xs font-bold text-white">
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  Jonli Chat & Emojilar
                </span>
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <Wifi className="w-3 h-3" />
                  Ulandi
                </span>
              </div>

              {/* Chat messages */}
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto py-1.5 space-y-1.5 text-xs">
                {onlineChatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
                  >
                    <span className="text-[9px] text-slate-500 font-semibold px-1">{msg.sender}</span>
                    <div
                      className={`px-2.5 py-1 rounded-xl max-w-[85%] text-xs ${
                        msg.isMe
                          ? 'bg-emerald-600 text-white rounded-br-none'
                          : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Emojis & Input */}
              <div className="pt-1.5 border-t border-slate-800 flex items-center gap-1">
                {['👍', '🔥', '👏', '🤝'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleSendChatMessage(emoji)}
                    className="p-1 rounded-lg hover:bg-slate-800 text-sm transition"
                  >
                    {emoji}
                  </button>
                ))}
                <input
                  type="text"
                  placeholder="Xabar yozing..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                  className="flex-1 px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pawn Promotion Modal */}
      {pendingPromotion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center">
            <h3 className="text-lg font-bold text-white mb-1">Piyodani almashtirish</h3>
            <p className="text-xs text-slate-400 mb-6">Piyoda oxirgi chiziqqa yetdi. Qaysi donaga aylantirmoqchisiz?</p>
            <div className="grid grid-cols-4 gap-3">
              {[
                { type: 'q', name: 'Vazir' },
                { type: 'r', name: "To'ra" },
                { type: 'b', name: 'Fil' },
                { type: 'n', name: 'Ot' }
              ].map((item) => (
                <button
                  key={item.type}
                  id={`promo-btn-${item.type}`}
                  onClick={() => handlePromotionSelect(item.type)}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-800 hover:bg-emerald-600 text-white transition hover:scale-105 border border-slate-700"
                >
                  <div className="w-10 h-10 mb-1">
                    <ChessPiece type={item.type} color={playerColor} />
                  </div>
                  <span className="text-[11px] font-semibold">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Game Result & ELO Update Modal */}
      {gameResult && (
        <EloGameOverModal
          gameResult={gameResult}
          gameMode={gameMode}
          oldElo={eloResultData ? eloResultData.oldElo : userProfile.currentElo}
          newElo={eloResultData ? eloResultData.newElo : userProfile.currentElo}
          eloChange={eloResultData ? eloResultData.eloChange : 0}
          botElo={activeOpponentElo}
          analysis={dynamicAnalysis}
          onRestart={handleReset}
          onClose={() => setGameResult(null)}
        />
      )}

      {/* Celebrity Bots Modal */}
      <CelebrityBotsModal
        isOpen={isCelebrityModalOpen}
        onClose={() => setIsCelebrityModalOpen(false)}
        onSelectBot={handleSelectCelebrityBot}
        currentSelectedBotId={selectedCelebrityBot?.id}
      />

      {/* Online Lobby Modal */}
      <OnlineLobbyModal
        isOpen={isOnlineModalOpen}
        onClose={() => setIsOnlineModalOpen(false)}
        onStartOnlineMatch={handleStartOnlineMatch}
        userElo={userProfile.currentElo}
      />
    </section>
  );
};
