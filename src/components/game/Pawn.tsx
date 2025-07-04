
"use client";
import Image from 'next/image';

export const Pawn = ({
  color,
  isSelectable,
  isSelected,
  onClick,
  characterImage,
  ...props
}: {
  color: string;
  isSelectable?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  characterImage?: string;
  [key: string]: any;
}) => {
  const SvgIcon = () => (
    <svg viewBox="0 0 32 48" className="w-full h-full drop-shadow-lg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C24.8366 0 32 7.16344 32 16C32 26.5 16 48 16 48C16 48 0 26.5 0 16C0 7.16344 7.16344 0 16 0Z" fill={color}/>
      <path d="M16 48L12 42L20 42L16 48Z" fill={color} stroke="black" strokeWidth="0.5" strokeLinejoin="round" />
      <path d="M25 8C25 8 19.5 13 19.5 20" stroke="white" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  return (
    <div
      className={`relative w-3/4 h-3/4 transition-all duration-300 ease-in-out flex items-center justify-center ${
        isSelectable ? 'cursor-pointer' : ''
      } ${isSelected ? 'scale-110' : ''}`}
      onClick={isSelectable ? onClick : undefined}
    >
      <div className={`relative w-full h-full ${isSelectable ? 'animate-bounce' : 'animate-bounce-soft'}`}>
        {isSelectable && <div className="absolute -inset-1 rounded-full bg-yellow-400/75 animate-ping"></div>}
        <SvgIcon />
        {characterImage && (
            <div className="absolute flex items-center justify-center w-full h-full top-[-15%]">
                 <Image 
                    src={characterImage} 
                    alt="character icon" 
                    width={16} 
                    height={16} 
                    className="rounded-full object-contain bg-white/50 border border-black/20 p-px"
                    {...props}
                 />
            </div>
        )}
      </div>
    </div>
  );
};
