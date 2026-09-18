import React, { useState } from 'react';
import { ChessPiece } from './ChessPiece';
import { Square } from 'chess.js';
import { BoardTheme } from '../types';

interface BoardSquareData {
  square: Square;
  type: string;
  color: 'w' | 'b';
}

interface BoardProps {
  board: (BoardSquareData | null)[][];
  turn: 'w' | 'b';
  isFlipped: boolean;
  selectedSquare: Square | null;
  validMoves: Square[];
  lastMove: { from: Square; to: Square } | null;
  checkSquare: Square | null;
  onSquareClick: (sq: Square) => void;
  onPieceDrop: (from: Square, to: Square) => void;
  isInteractive: boolean;
  theme?: BoardTheme;
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

// Eye-relaxing theme palette definitions
const THEME_COLORS: Record<BoardTheme, { light: string; dark: string; textLight: string; textDark: string }> = {
  emerald: {
    light: 'bg-[#ebecd0]',
    dark: 'bg-[#739552]',
    textLight: 'text-[#739552]',
    textDark: 'text-[#ebecd0]',
  },
  wood: {
    light: 'bg-[#f0d9b5]',
    dark: 'bg-[#b58863]',
    textLight: 'text-[#b58863]',
    textDark: 'text-[#f0d9b5]',
  },
  slate: {
    light: 'bg-[#dee3e6]',
    dark: 'bg-[#8ca2ad]',
    textLight: 'text-[#8ca2ad]',
    textDark: 'text-[#dee3e6]',
  },
  sand: {
    light: 'bg-[#eae3d2]',
    dark: 'bg-[#a38c7b]',
    textLight: 'text-[#a38c7b]',
    textDark: 'text-[#eae3d2]',
  },
};

export const Board: React.FC<BoardProps> = ({
  board,
  isFlipped,
  selectedSquare,
  validMoves,
  lastMove,
  checkSquare,
  onSquareClick,
  onPieceDrop,
  isInteractive,
  theme = 'emerald'
}) => {
  const [draggedSquare, setDraggedSquare] = useState<Square | null>(null);

  const displayFiles = isFlipped ? [...FILES].reverse() : FILES;
  const displayRanks = isFlipped ? [...RANKS].reverse() : RANKS;

  const handleDragStart = (e: React.DragEvent, sq: Square, piece: BoardSquareData | null) => {
    if (!isInteractive || !piece) {
      e.preventDefault();
      return;
    }
    setDraggedSquare(sq);
    e.dataTransfer.setData('text/plain', sq);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetSquare: Square) => {
    e.preventDefault();
    const fromSquare = (e.dataTransfer.getData('text/plain') as Square) || draggedSquare;
    if (fromSquare && fromSquare !== targetSquare) {
      onPieceDrop(fromSquare, targetSquare);
    }
    setDraggedSquare(null);
  };

  const colors = THEME_COLORS[theme] || THEME_COLORS.emerald;

  return (
    <div className="relative select-none w-full max-w-[540px] aspect-square rounded-3xl p-2.5 sm:p-3.5 bg-gradient-to-b from-slate-800/90 to-slate-900/95 shadow-2xl border border-slate-700/60 ring-1 ring-emerald-500/10 touch-manipulation">
      <div className="relative w-full h-full grid grid-cols-8 grid-rows-8 rounded-2xl overflow-hidden border border-slate-700/70 shadow-inner">
        {displayRanks.map((rank, rIdx) => {
          return displayFiles.map((file, fIdx) => {
            const squareName = `${file}${rank}` as Square;

            const actualRow = 8 - parseInt(rank, 10);
            const actualCol = FILES.indexOf(file);
            const piece = board[actualRow]?.[actualCol] ?? null;

            const isLight = (actualRow + actualCol) % 2 === 0;
            const isSelected = selectedSquare === squareName;
            const isValidMove = validMoves.includes(squareName);
            const isLastMoveFrom = lastMove?.from === squareName;
            const isLastMoveTo = lastMove?.to === squareName;
            const isKingInCheck = checkSquare === squareName;

            return (
              <div
                key={squareName}
                id={`square-${squareName}`}
                onClick={() => isInteractive && onSquareClick(squareName)}
                onDragOver={handleDragOver}
                onDrop={(e) => isInteractive && handleDrop(e, squareName)}
                className={`relative flex items-center justify-center cursor-pointer transition-colors duration-150 ${
                  isLight ? colors.light : colors.dark
                } ${isSelected ? '!bg-amber-400/85 ring-2 ring-inset ring-amber-300' : ''} ${
                  isLastMoveFrom || isLastMoveTo ? '!bg-yellow-300/45' : ''
                } ${isKingInCheck ? '!bg-red-500/85 animate-pulse ring-2 ring-red-400' : ''}`}
              >
                {/* Coordinates labels */}
                {fIdx === 0 && (
                  <span
                    className={`absolute top-0.5 left-1 text-[9px] sm:text-[11px] font-bold pointer-events-none ${
                      isLight ? colors.textLight : colors.textDark
                    }`}
                  >
                    {rank}
                  </span>
                )}
                {rIdx === 7 && (
                  <span
                    className={`absolute bottom-0.5 right-1 text-[9px] sm:text-[11px] font-bold pointer-events-none ${
                      isLight ? colors.textLight : colors.textDark
                    }`}
                  >
                    {file}
                  </span>
                )}

                {/* Chess Piece */}
                {piece && (
                  <div
                    draggable={isInteractive}
                    onDragStart={(e) => handleDragStart(e, squareName, piece)}
                    onDragEnd={() => setDraggedSquare(null)}
                    className={`w-[85%] h-[85%] flex items-center justify-center transition-transform hover:scale-105 active:scale-95 ${
                      isInteractive ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
                    }`}
                  >
                    <ChessPiece type={piece.type} color={piece.color} />
                  </div>
                )}

                {/* Valid Move Indicator */}
                {isValidMove && !piece && (
                  <div className="absolute w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-slate-900/35 ring-2 ring-emerald-400/80 pointer-events-none transition-transform animate-scale-in" />
                )}

                {/* Valid Capture Target Indicator */}
                {isValidMove && piece && (
                  <div className="absolute inset-0 rounded-none border-4 border-red-500/60 pointer-events-none bg-red-500/20" />
                )}
              </div>
            );
          });
        })}
      </div>
    </div>
  );
};
