import React from 'react';
import { Star } from 'lucide-react';

const Arrow = ({ direction, colorClass }: { direction: 'up' | 'down' | 'left' | 'right'; colorClass: string }) => {
    const rotations = {
        up: '-rotate-90',
        right: 'rotate-0',
        down: 'rotate-90',
        left: 'rotate-180'
    };
    return (
        <svg viewBox="0 0 24 24" className={`w-3/4 h-3/4 ${colorClass} transform ${rotations[direction]}`}>
            <path fill="currentColor" d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z" />
        </svg>
    );
};

export const LudoBoard = () => {
  const PathSquare = ({ className = "", children }: { className?: string, children?: React.ReactNode }) => 
    <div className={`border border-black/10 flex items-center justify-center ${className}`}>{children}</div>;
  
  const HomePawnSpot = () => 
    <div className="aspect-square bg-white/60 rounded-full shadow-inner"></div>;

  const HomeBase = ({ bgColor, innerBgColor }: { bgColor: string, innerBgColor: string }) => (
    <div className={`p-1 sm:p-2 ${bgColor}`}>
      <div className={`grid h-full w-full grid-cols-2 grid-rows-2 gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg ${innerBgColor}`}>
        <HomePawnSpot /> <HomePawnSpot />
        <HomePawnSpot /> <HomePawnSpot />
      </div>
    </div>
  );

  const SafeStar = () => <Star className="text-white/80 h-3/4 w-3/4" fill="currentColor" />;

  const cells: React.ReactNode[] = [];
  
  // Corners
  cells.push(<div key="red-home" className="col-span-6 row-span-6 rounded-tl-xl overflow-hidden"><HomeBase bgColor="bg-red-500" innerBgColor="bg-red-400" /></div>);
  cells.push(<div key="green-home" className="col-span-6 row-span-6 col-start-10 rounded-tr-xl overflow-hidden"><HomeBase bgColor="bg-green-500" innerBgColor="bg-green-400" /></div>);
  cells.push(<div key="blue-home" className="col-span-6 row-span-6 row-start-10 rounded-bl-xl overflow-hidden"><HomeBase bgColor="bg-blue-500" innerBgColor="bg-blue-400" /></div>);
  cells.push(<div key="yellow-home" className="col-span-6 row-span-6 col-start-10 row-start-10 rounded-br-xl overflow-hidden"><HomeBase bgColor="bg-yellow-400" innerBgColor="bg-yellow-300" /></div>);

  // Center
  cells.push(
    <div key="center" className="col-start-7 col-span-3 row-start-7 row-span-3">
         <div className="w-full h-full relative">
            <div style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)'}} className="absolute inset-0 bg-red-500"></div>
            <div style={{ clipPath: 'polygon(0 50%, 100% 0, 100% 100%)'}} className="absolute inset-0 bg-green-500"></div>
            <div style={{ clipPath: 'polygon(50% 0, 0 100%, 100% 100%)'}} className="absolute inset-0 bg-yellow-400"></div>
            <div style={{ clipPath: 'polygon(0 0, 0 100%, 100% 50%)'}} className="absolute inset-0 bg-blue-500"></div>
        </div>
    </div>
  );

  // Paths
  const pathCoordinates = [
    // Top arm
    ...Array.from({length: 6}, (_, i) => ({r: i, c: 6})),
    ...Array.from({length: 6}, (_, i) => ({r: i, c: 8})),
    // Right arm
    ...Array.from({length: 6}, (_, i) => ({r: 6, c: 9+i})),
    ...Array.from({length: 6}, (_, i) => ({r: 8, c: 9+i})),
    // Bottom arm
    ...Array.from({length: 6}, (_, i) => ({r: 9+i, c: 6})),
    ...Array.from({length: 6}, (_, i) => ({r: 9+i, c: 8})),
    // Left arm
    ...Array.from({length: 6}, (_, i) => ({r: 6, c: i})),
    ...Array.from({length: 6}, (_, i) => ({r: 8, c: i})),
    // Home runs
    ...Array.from({length: 5}, (_, i) => ({r: i+1, c: 7, bg: 'bg-red-500'})),
    ...Array.from({length: 5}, (_, i) => ({r: 7, c: 9+i, bg: 'bg-green-500'})),
    ...Array.from({length: 5}, (_, i) => ({r: 9+i, c: 7, bg: 'bg-yellow-400'})),
    ...Array.from({length: 5}, (_, i) => ({r: 7, c: i+1, bg: 'bg-blue-500'})),
  ];

  pathCoordinates.forEach(({r, c, bg}, index) => {
    cells.push(<PathSquare key={`path-${r}-${c}-${index}`} className={`${bg ?? ''}`} style={{gridRow: r+1, gridColumn: c+1}}/>);
  });
  
  // Arrows & Stars
  const markers = [
    // Red
    {r: 6, c: 1, el: <Arrow direction="up" colorClass="text-red-500"/>, safe: true},
    {r: 1, c: 6, safe: true},
    // Green
    {r: 1, c: 8, el: <Arrow direction="right" colorClass="text-green-500"/>, safe: true},
    {r: 6, c: 13, safe: true},
    // Yellow
    {r: 8, c: 13, el: <Arrow direction="down" colorClass="text-yellow-500"/>, safe: true},
    {r: 13, c: 8, safe: true},
    // Blue
    {r: 13, c: 6, el: <Arrow direction="left" colorClass="text-blue-500"/>, safe: true},
    {r: 8, c: 1, safe: true},
  ];

  markers.forEach(({r,c,el, safe}) => {
    cells.push(<PathSquare key={`marker-${r}-${c}`} className={safe ? 'bg-gray-200' : ''} style={{gridRow: r+1, gridColumn: c+1}}>{el ?? (safe ? <SafeStar /> : null)}</PathSquare>);
  })


  return (
    <div className="relative mx-auto aspect-square w-full max-w-[90vw] rounded-2xl bg-white p-1 shadow-lg sm:p-2 md:max-w-[500px] lg:max-w-[600px]">
      <div className="grid h-full w-full grid-cols-15 grid-rows-15">
        {cells}
      </div>
    </div>
  );
};
