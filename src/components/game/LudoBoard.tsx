
import React from 'react';
import { Star } from 'lucide-react';

const Arrow = ({ direction, colorClass }: { direction: 'up' | 'down' | 'left' | 'right'; colorClass: string }) => {
    const rotations = {
        up: 'rotate-[270deg]',
        right: 'rotate-0',
        down: 'rotate-90',
        left: 'rotate-180'
    };
    return (
        <svg viewBox="0 0 24 24" className={`w-3/4 h-3/4 ${colorClass} transform ${rotations[direction]}`}>
            <path fill="currentColor" d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
        </svg>
    );
};

export const LudoBoard = () => {
  const Tile = ({ className = "", children }: { className?: string; children?: React.ReactNode }) => (
    <div className={`flex items-center justify-center border border-black/20 ${className}`}>{children}</div>
  );

  const HomeBase = ({ bgColor }: { bgColor: string }) => (
    <div className={`w-full h-full ${bgColor} border-2 border-black grid grid-cols-2 grid-rows-2 gap-2 p-4`}>
        <div className="flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-white/50 border border-black/20"></div>
        </div>
        <div className="flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-white/50 border border-black/20"></div>
        </div>
        <div className="flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-white/50 border border-black/20"></div>
        </div>
        <div className="flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-white/50 border border-black/20"></div>
        </div>
    </div>
  );

  const SafeStar = ({colorClass = 'text-black/50'}: {colorClass?: string}) => <Star className={`h-3/4 w-3/4 ${colorClass}`} fill="currentColor" />;

  const boardCells = [];
  
  const layout = [
    'R R R R R R R . . . G G G G G G G',
    'R R R R R R R . g . G G G G G G G',
    'R R R R R R R . g . G G G G G G G',
    'R R R R R R R . g . G G G G G G G',
    'R R R R R R R . g . G G G G G G G',
    'R R R R R R R . g . G G G G G G G',
    'R R R R R R R . g . G G G G G G G',
    '. . . . . . . C C C . . . . . . .',
    '. r r r r r r C C C y y y y y y .',
    '. . . . . . . C C C . . . . . . .',
    'B B B B B B B . b . Y Y Y Y Y Y Y',
    'B B B B B B B . b . Y Y Y Y Y Y Y',
    'B B B B B B B . b . Y Y Y Y Y Y Y',
    'B B B B B B B . b . Y Y Y Y Y Y Y',
    'B B B B B B B . b . Y Y Y Y Y Y Y',
    'B B B B B B B . b . Y Y Y Y Y Y Y',
    'B B B B B B B . . . Y Y Y Y Y Y Y',
  ].map(row => row.split(/\s+/));

  const colorMap: { [key: string]: string } = {
    '.': 'bg-yellow-100',
    'R': 'bg-red-500', 'G': 'bg-green-500', 'B': 'bg-blue-500', 'Y': 'bg-yellow-400',
    'r': 'bg-red-500', 'g': 'bg-green-500', 'b': 'bg-blue-500', 'y': 'bg-yellow-400',
  };
  
  const startingTiles: { [key: string]: { dir: 'up' | 'down' | 'left' | 'right'; playerChar: 'r' | 'g' | 'b' | 'y' } } = {
    '7-1':  { dir: 'right', playerChar: 'r' },
    '1-9':  { dir: 'down',  playerChar: 'g' },
    '9-15': { dir: 'left',  playerChar: 'y' },
    '15-7': { dir: 'up',    playerChar: 'b' },
  };

  const safeTiles: { [key: string]: string } = {
    '3-7': 'text-red-500',
    '7-13': 'text-green-500',
    '13-9': 'text-yellow-400',
    '9-3': 'text-blue-500',
  };

  for (let r = 0; r < 17; r++) {
    for (let c = 0; c < 17; c++) {
      const key = `${r}-${c}`;
      let cellType = layout[r][c];

      if (cellType === 'R' && r < 7 && c < 7) {
        if (r === 0 && c === 0) boardCells.push(<div key={key} className="col-span-7 row-span-7 h-full w-full"><HomeBase bgColor="bg-red-500"/></div>);
      } else if (cellType === 'G' && r < 7 && c > 9) {
        if (r === 0 && c === 10) boardCells.push(<div key={key} className="col-span-7 row-span-7 h-full w-full"><HomeBase bgColor="bg-green-500"/></div>);
      } else if (cellType === 'B' && r > 9 && c < 7) {
        if (r === 10 && c === 0) boardCells.push(<div key={key} className="col-span-7 row-span-7 h-full w-full"><HomeBase bgColor="bg-blue-500"/></div>);
      } else if (cellType === 'Y' && r > 9 && c > 9) {
        if (r === 10 && c === 10) boardCells.push(<div key={key} className="col-span-7 row-span-7 h-full w-full"><HomeBase bgColor="bg-yellow-400"/></div>);
      } else if (cellType === 'C') {
        if (r === 7 && c === 7) {
          boardCells.push(
            <div key="center" className="col-start-8 col-span-3 row-start-8 row-span-3">
              <div className="w-full h-full relative">
                <div style={{ clipPath: 'polygon(0 0, 100% 0, 50% 50%)'}} className="absolute inset-0 bg-green-500"></div>
                <div style={{ clipPath: 'polygon(100% 0, 100% 100%, 50% 50%)'}} className="absolute inset-0 bg-yellow-400"></div>
                <div style={{ clipPath: 'polygon(0 100%, 100% 100%, 50% 50%)'}} className="absolute inset-0 bg-blue-500"></div>
                <div style={{ clipPath: 'polygon(0 0, 0 100%, 50% 50%)'}} className="absolute inset-0 bg-red-500"></div>
              </div>
            </div>
          );
        }
      } else {
        let cellContent = null;
        let tileBg = colorMap[cellType] || 'bg-yellow-100';
        
        const startInfo = startingTiles[key];
        const safeColor = safeTiles[key];

        if (startInfo) {
          cellContent = <Arrow direction={startInfo.dir} colorClass="text-white" />;
          tileBg = colorMap[startInfo.playerChar];
        } else if (safeColor) {
          cellContent = <SafeStar colorClass={safeColor} />;
        }
        
        boardCells.push(<Tile key={key} className={`${tileBg}`}>{cellContent}</Tile>);
      }
    }
  }

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[95vw] rounded-2xl bg-white p-3 shadow-lg sm:p-4 md:max-w-[500px] lg:max-w-[600px] border-4 border-black">
      <div className="grid h-full w-full grid-cols-17 grid-rows-17 gap-px bg-black">
        {boardCells}
      </div>
    </div>
  );
};
