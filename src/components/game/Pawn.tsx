"use client";

export const Pawn = ({
  color,
  isSelectable,
  isSelected,
  onClick,
}: {
  color: string;
  isSelectable?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}) => {
  const SvgIcon = () => (
    <svg viewBox="0 0 52 62" className="w-full h-full drop-shadow-lg" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="26" cy="28" r="20" fill={color} stroke="black" strokeWidth="2"/>
        <path d="M14.5 21C17.6534 16.6331 21.6162 13.5932 26 14" stroke="white" strokeOpacity="0.7" strokeWidth="3" strokeLinecap="round"/>
        <path d="M25 48 C22.25 51.75 25.5 54.5 26 56.5 C26.5 54.5 29.75 51.75 27 48 C29.5 46.5 22.5 46.5 25 48Z" fill={color} stroke="black" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <div
      className={`relative w-full h-full transition-all duration-300 ease-in-out flex items-center justify-center ${
        isSelectable ? 'cursor-pointer' : ''
      } ${isSelected ? 'scale-110' : ''}`}
      onClick={isSelectable ? onClick : undefined}
    >
      <div className={`relative w-full h-full ${isSelectable ? 'animate-bounce' : 'animate-bounce-soft'}`}>
        {isSelectable && <div className="absolute -inset-1 rounded-full bg-yellow-400/75 animate-ping"></div>}
        <SvgIcon />
      </div>
    </div>
  );
};
