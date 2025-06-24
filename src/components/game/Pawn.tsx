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
    <svg viewBox="0 0 50 60" className="w-full h-full drop-shadow-lg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="25" cy="25" r="24" fill={color} stroke="black" strokeWidth="2" />
      <path d="M25 49 L20 59 L30 59 Z" fill={color} stroke="black" strokeWidth="2" strokeLinejoin="round" />
      <path d="M35 15 A 15 15 0 0 0 20 30" stroke="white" strokeOpacity="0.5" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );

  return (
    <div
      className={`relative w-5/6 h-5/6 transition-all duration-300 ease-in-out flex items-center justify-center ${
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
