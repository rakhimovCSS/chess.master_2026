import React from 'react';

interface ChessPieceProps {
  type: string; // 'p' | 'n' | 'b' | 'r' | 'q' | 'k'
  color: 'w' | 'b';
  className?: string;
}

export const ChessPiece: React.FC<ChessPieceProps> = ({ type, color, className = "w-full h-full" }) => {
  const isWhite = color === 'w';

  // Crisp SVG Staunton chess piece designs
  switch (type.toLowerCase()) {
    case 'p': // Pawn
      return (
        <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"
            fill={isWhite ? "#f8fafc" : "#1e293b"}
            stroke={isWhite ? "#0f172a" : "#020617"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {isWhite && (
            <path
              d="M17.5 26c1.5 1 3.2 1.5 5 1.5s3.5-.5 5-1.5"
              stroke="#cbd5e1"
              strokeWidth="1"
            />
          )}
        </svg>
      );

    case 'n': // Knight
      return (
        <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M22 10c-3.5 0-7 2-8 5 0 0-1 4 2 6-1 1-3 2-3 5 0 4 3 7 7 7h1c-1 2-2 4-5 6.5h18c1-4 0-12-1-14.5-1-2.5-3-4-3-6 0-3-2.5-5.5-5.5-6.5-1-.3-2.5-.5-2.5-3z"
            fill={isWhite ? "#f8fafc" : "#1e293b"}
            stroke={isWhite ? "#0f172a" : "#020617"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="17" cy="17" r="1.5" fill={isWhite ? "#0f172a" : "#38bdf8"} />
          <path
            d="M14 26c2 1 5 1.5 7 0"
            stroke={isWhite ? "#0f172a" : "#94a3b8"}
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M9.5 39.5h26"
            stroke={isWhite ? "#0f172a" : "#020617"}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'b': // Bishop
      return (
        <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.94 3-2 3-2z"
            fill={isWhite ? "#f8fafc" : "#1e293b"}
            stroke={isWhite ? "#0f172a" : "#020617"}
            strokeWidth="1.5"
          />
          <path
            d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"
            fill={isWhite ? "#f8fafc" : "#1e293b"}
            stroke={isWhite ? "#0f172a" : "#020617"}
            strokeWidth="1.5"
          />
          <circle cx="22.5" cy="8.5" r="2" fill={isWhite ? "#f8fafc" : "#1e293b"} stroke={isWhite ? "#0f172a" : "#020617"} strokeWidth="1.5" />
          <path d="M20.5 16h4M22.5 14v4" stroke={isWhite ? "#0f172a" : "#94a3b8"} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'r': // Rook
      return (
        <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M9 39h27v-3H9v3zm3-3v-4h21v4H12zm2-4l1-14h15l1 14H14zm-3-15V11h4v3h3v-3h5v3h3v-3h4v6H11z"
            fill={isWhite ? "#f8fafc" : "#1e293b"}
            stroke={isWhite ? "#0f172a" : "#020617"}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M12 36h21M14 32h17M15 17h15" stroke={isWhite ? "#cbd5e1" : "#475569"} strokeWidth="1" />
        </svg>
      );

    case 'q': // Queen
      return (
        <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M9 39h27v-3H9v3zm3-3v-3h21v3H12zm-3-8l3-13 7 7 3.5-10 3.5 10 7-7 3 13H9z"
            fill={isWhite ? "#f8fafc" : "#1e293b"}
            stroke={isWhite ? "#0f172a" : "#020617"}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <circle cx="9" cy="15" r="1.75" fill={isWhite ? "#f8fafc" : "#1e293b"} stroke={isWhite ? "#0f172a" : "#020617"} strokeWidth="1.2" />
          <circle cx="16" cy="12" r="1.75" fill={isWhite ? "#f8fafc" : "#1e293b"} stroke={isWhite ? "#0f172a" : "#020617"} strokeWidth="1.2" />
          <circle cx="22.5" cy="10" r="1.75" fill={isWhite ? "#f8fafc" : "#1e293b"} stroke={isWhite ? "#0f172a" : "#020617"} strokeWidth="1.2" />
          <circle cx="29" cy="12" r="1.75" fill={isWhite ? "#f8fafc" : "#1e293b"} stroke={isWhite ? "#0f172a" : "#020617"} strokeWidth="1.2" />
          <circle cx="36" cy="15" r="1.75" fill={isWhite ? "#f8fafc" : "#1e293b"} stroke={isWhite ? "#0f172a" : "#020617"} strokeWidth="1.2" />
          <circle cx="22.5" cy="24" r="2.5" fill={isWhite ? "#f59e0b" : "#eab308"} />
        </svg>
      );

    case 'k': // King
      return (
        <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M22.5 11.63V6M20 8h5"
            stroke={isWhite ? "#0f172a" : "#e2e8f0"}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M9 39h27v-3H9v3zm2.5-3v-4h22v4h-22zm2-4l-2-12c2.5-2.5 7.5-3 11-1 3.5-2 8.5-1.5 11 1l-2 12H13.5z"
            fill={isWhite ? "#f8fafc" : "#1e293b"}
            stroke={isWhite ? "#0f172a" : "#020617"}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <circle cx="22.5" cy="20" r="2" fill={isWhite ? "#fbbf24" : "#f59e0b"} />
        </svg>
      );

    default:
      return null;
  }
};
