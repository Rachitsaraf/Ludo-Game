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
  
  const HomePawnPlaceholder = () => 
    <div className="aspect-square bg-white/60 rounded-full shadow-inner"></div>;

  const HomeBase = ({ bgColor, innerBgColor }: { bgColor: string, innerBgColor: string }) => (
    <div className={`p-1 sm:p-2 ${bgColor}`}>
      <div className={`grid h-full w-full grid-cols-2 grid-rows-2 gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg ${innerBgColor}`}>
        <HomePawnPlaceholder /> <HomePawnPlaceholder />
        <HomePawnPlaceholder /> <HomePawnPlaceholder />
      </div>
    </div>
  );

  const SafeStar = () => <Star className="text-white/80 h-3/4 w-3/4" fill="currentColor" />;

  const cells: React.ReactNode[] = [];
  
  // Top-left block (Red)
  cells.push(<div key="red-home" className="col-span-6 row-span-6 rounded-tl-xl overflow-hidden"><HomeBase bgColor="bg-red-500" innerBgColor="bg-red-400" /></div>);
  
  // Top-right block (Green)
  cells.push(<div key="green-home" className="col-span-6 row-span-6 col-start-10 rounded-tr-xl overflow-hidden"><HomeBase bgColor="bg-green-500" innerBgColor="bg-green-400" /></div>);
  
  // Bottom-left block (Blue)
  cells.push(<div key="blue-home" className="col-span-6 row-span-6 row-start-10 rounded-bl-xl overflow-hidden"><HomeBase bgColor="bg-blue-500" innerBgColor="bg-blue-400" /></div>);

  // Bottom-right block (Yellow)
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

  // Vertical Path (Top)
  for (let i = 0; i < 6; i++) {
    cells.push(<PathSquare key={`vt-1-${i}`} className="col-start-7" style={{gridRow: i+1}}/>);
    cells.push(<PathSquare key={`vt-2-${i}`} className={`col-start-8 ${i > 0 ? 'bg-red-500' : ''}`} style={{gridRow: i+1}}/>);
    cells.push(<PathSquare key={`vt-3-${i}`} className="col-start-9" style={{gridRow: i+1}}/>);
  }
  cells.push(<PathSquare key="red-start" className="col-start-8 bg-red-500" style={{gridRow: 2}}><Arrow direction="down" colorClass="text-white" /></PathSquare>);
  cells.push(<PathSquare key="red-safe" className="col-start-7 bg-red-300" style={{gridRow: 2}}><SafeStar /></PathSquare>);


  // Vertical Path (Bottom)
  for (let i = 0; i < 6; i++) {
    cells.push(<PathSquare key={`vb-1-${i}`} className="col-start-7" style={{gridRow: i+10}}/>);
    cells.push(<PathSquare key={`vb-2-${i}`} className={`col-start-8 ${i < 5 ? 'bg-yellow-400' : ''}`} style={{gridRow: i+10}}/>);
    cells.push(<PathSquare key={`vb-3-${i}`} className="col-start-9" style={{gridRow: i+10}}/>);
  }
  cells.push(<PathSquare key="yellow-start" className="col-start-8 bg-yellow-400" style={{gridRow: 14}}><Arrow direction="up" colorClass="text-white" /></PathSquare>);
  cells.push(<PathSquare key="yellow-safe" className="col-start-9 bg-yellow-300" style={{gridRow: 14}}><SafeStar /></PathSquare>);

  // Horizontal Path (Left)
  for (let i = 0; i < 6; i++) {
    cells.push(<PathSquare key={`hl-1-${i}`} className="row-start-7" style={{gridColumn: i+1}}/>);
    cells.push(<PathSquare key={`hl-2-${i}`} className={`row-start-8 ${i < 5 ? 'bg-blue-500' : ''}`} style={{gridColumn: i+1}}/>);
    cells.push(<PathSquare key={`hl-3-${i}`} className="row-start-9" style={{gridColumn: i+1}}/>);
  }
  cells.push(<PathSquare key="blue-start" className="row-start-8 bg-blue-500" style={{gridColumn: 2}}><Arrow direction="right" colorClass="text-white" /></PathSquare>);
  cells.push(<PathSquare key="blue-safe" className="row-start-9 bg-blue-300" style={{gridColumn: 2}}><SafeStar /></PathSquare>);
  
  // Horizontal Path (Right)
  for (let i = 0; i < 6; i++) {
    cells.push(<PathSquare key={`hr-1-${i}`} className="row-start-7" style={{gridColumn: i+10}}/>);
    cells.push(<PathSquare key={`hr-2-${i}`} className={`row-start-8 ${i > 0 ? 'bg-green-500' : ''}`} style={{gridColumn: i+10}}/>);
    cells.push(<PathSquare key={`hr-3-${i}`} className="row-start-9" style={{gridColumn: i+10}}/>);
  }
  cells.push(<PathSquare key="green-start" className="row-start-8 bg-green-500" style={{gridColumn: 14}}><Arrow direction="left" colorClass="text-white" /></PathSquare>);
  cells.push(<PathSquare key="green-safe" className="row-start-7 bg-green-300" style={{gridColumn: 14}}><SafeStar /></PathSquare>);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[90vw] rounded-2xl bg-white p-1 shadow-lg sm:p-2 md:max-w-[500px] lg:max-w-[600px]">
      <div className="grid h-full w-full grid-cols-15 grid-rows-15">
        {cells}
      </div>
    </div>
  );
};
