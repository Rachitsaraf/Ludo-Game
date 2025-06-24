"use client";

export const Pawn = ({ color, canMove }: { color: string; canMove?: boolean }) => {
  const SvgIcon = () => (
    <svg viewBox="0 0 100 125" className="w-6 h-8 md:w-8 md:h-10 drop-shadow-lg">
      <path
        fill={color}
        d="M50,5C27.9,5,10,22.9,10,45c0,16.5,9.8,30.8,23.8,37.3c1,0.5,2.2,0.7,3.3,0.7c2.1,0,4.1-0.9,5.5-2.6l2.9-3.4 c1.3-1.5,3.2-2.4,5.2-2.4s3.9,0.9,5.2,2.4l2.9,3.4c1.4,1.7,3.4,2.6,5.5,2.6c1.1,0,2.2-0.2,3.3-0.7C80.2,75.8,90,61.5,90,45 C90,22.9,72.1,5,50,5z"
      />
      <path
        fill="rgba(255,255,255,0.4)"
        d="M50,5C38.4,5,28.7,11.1,23.1,19.9c-0.2,0.3-0.4,0.6-0.5,1c10.4-5.3,22.5-5.3,34.8,0c-0.2-0.4-0.4-0.7-0.5-1 C71.3,11.1,61.6,5,50,5z"
      />
      <path
        fill={color}
        d="M48.5,82.4l-2.9,3.4c-1.4,1.7-3.4,2.6-5.5,2.6c-1.1,0-2.2-0.2-3.3-0.7c-0.5-0.2-1-0.5-1.5-0.8l1.7,2.1 c1.3,1.6,3.2,2.5,5.1,2.5c2.1,0,4.1-0.9,5.5-2.6l2.9-3.4c1.3-1.5,3.2-2.4,5.2-2.4s3.9,0.9,5.2,2.4l2.9,3.4 c1.4,1.7,3.4,2.6,5.5,2.6c2,0,3.8-0.9,5.1-2.5l1.7-2.1c-0.5,0.3-1,0.6-1.5,0.8c-1,0.5-2.2,0.7-3.3,0.7c-2.1,0-4.1-0.9-5.5-2.6 l-2.9-3.4c-1.3-1.5-3.2-2.4-5.2-2.4S49.8,80.9,48.5,82.4z M45.8,92.2L45.8,92.2l5.4,6.3l5.4-6.3L45.8,92.2z"
      />
      <polygon fill="#333" points="48.5,95.5 50,97.3 51.5,95.5 50,93.2 " />
    </svg>
  );

  return (
    <div
      className={`relative transition-all duration-500 ease-in-out cursor-pointer ${canMove ? 'filter brightness-125' : ''}`}
    >
      <div className="relative animate-bounce-soft">
        {canMove && <div className="absolute -inset-1 rounded-full bg-white/50 animate-ping"></div>}
        <SvgIcon />
      </div>
    </div>
  );
};
