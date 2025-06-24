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
  const Tile = ({ className = "", children, ...props }: { className?: string, children?: React.ReactNode, style?: React.CSSProperties }) => 
    <div className={`border border-black/10 flex items-center justify-center ${className}`} {...props}>{children}</div>;
  
  const HomePawnSpot = () => 
    <div className="aspect-square bg-white/80 rounded-full border-2 border-white/90 shadow-inner"></div>;

  const HomeBase = ({ bgColor, children }: { bgColor: string, children?: React.ReactNode }) => (
    <div className={`p-4 ${bgColor} flex items-center justify-center`}>
      <div className="grid h-2/3 w-2/3 grid-cols-2 grid-rows-2 gap-3 p-3 rounded-lg bg-white/40">
        {children || <><HomePawnSpot /> <HomePawnSpot /> <HomePawnSpot /> <HomePawnSpot /></>}
      </div>
    </div>
  );

  const SafeStar = () => <Star className="text-black/50 h-3/4 w-3/4" fill="currentColor" />;

  const boardCells = [];

  // This defines the visual layout of the 15x15 board
  // R=Red, G=Green, B=Blue, Y=Yellow
  // s=safe, .
  // r/g/b/y are home path tiles
  const layout = [
    'R R R R R R . g s . G G G G G G',
    'R R R R R R . g . . G G G G G G',
    'R R R R R R . g . . G G G G G G',
    'R R R R R R . g . . G G G G G G',
    'R R R R R R . g . . G G G G G G',
    'R R R R R R . g . . G G G G G G',
    '. . . . . s r g g g s . . . . .',
    'b b b b b . R G Y B . y y y y y',
    '. . . . . s b y y y s . . . . .',
    'B B B B B B . b . . Y Y Y Y Y Y',
    'B B B B B B . b . . Y Y Y Y Y Y',
    'B B B B B B . b . . Y Y Y Y Y Y',
    'B B B B B B . b . . Y Y Y Y Y Y',
    'B B B B B B . b . . Y Y Y Y Y Y',
    'B B B B B B . s . . Y Y Y Y Y Y',
  ].map(row => row.split(' '));

  const colorMap: { [key: string]: string } = {
    '.': 'bg-white',
    's': 'bg-white',
    // Home Bases
    'R': 'bg-red-400',
    'G': 'bg-green-400',
    'B': 'bg-blue-400',
    'Y': 'bg-yellow-400',
    // Home paths
    'r': 'bg-red-400',
    'g': 'bg-green-400',
    'b': 'bg-blue-400',
    'y': 'bg-yellow-400'
  };

  const startingTiles = { '6-1': 'red', '1-8': 'green', '8-13': 'yellow', '13-6': 'blue' };
  const arrowDirections: {[key: string]: 'up' | 'down' | 'left' | 'right'} = {
    red: 'up', green: 'right', yellow: 'down', blue: 'left'
  };
  const safeTiles = ['0-8', '1-6', '6-0', '6-14', '8-1', '8-13', '13-8', '14-6'];

  for (let r = 0; r < 15; r++) {
    for (let c = 0; c < 15; c++) {
      const key = `${r}-${c}`;
      let cellContent = null;
      let cellType = layout[r][c];

      // Handle corner Home Bases
      if (cellType === 'R' && r < 6 && c < 6) {
        if (r === 0 && c === 0) boardCells.push(<div key={key} className="col-span-6 row-span-6"><HomeBase bgColor="bg-red-400"/></div>);
      } else if (cellType === 'G' && r < 6 && c > 8) {
        if (r === 0 && c === 9) boardCells.push(<div key={key} className="col-span-6 row-span-6"><HomeBase bgColor="bg-green-400"/></div>);
      } else if (cellType === 'B' && r > 8 && c < 6) {
        if (r === 9 && c === 0) boardCells.push(<div key={key} className="col-span-6 row-span-6"><HomeBase bgColor="bg-blue-400"/></div>);
      } else if (cellType === 'Y' && r > 8 && c > 8) {
        if (r === 9 && c === 9) boardCells.push(<div key={key} className="col-span-6 row-span-6"><HomeBase bgColor="bg-yellow-400"/></div>);
      } 
      // Handle center
      else if (['R','G','B','Y'].includes(cellType) && r>5 && r<9 && c>5 && c<9) {
          if (r === 7 && c === 7) {
            boardCells.push(
            <div key="center" className="col-start-7 col-span-3 row-start-7 row-span-3">
                <div className="w-full h-full relative">
                    <div style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)'}} className="absolute inset-0 bg-red-400"></div>
                    <div style={{ clipPath: 'polygon(0 50%, 100% 0, 100% 100%)'}} className="absolute inset-0 bg-green-400"></div>
                    <div style={{ clipPath: 'polygon(50% 0, 0 100%, 100% 100%)'}} className="absolute inset-0 bg-yellow-400"></div>
                    <div style={{ clipPath: 'polygon(0 0, 0 100%, 100% 50%)'}} className="absolute inset-0 bg-blue-400"></div>
                </div>
            </div>);
          }
      }
      else if (cellType !== 'R' && cellType !== 'G' && cellType !== 'B' && cellType !== 'Y') {
        const startColor = startingTiles[key as keyof typeof startingTiles];
        if (startColor) {
            cellContent = <Arrow direction={arrowDirections[startColor]} colorClass={`text-${startColor}-600`} />;
            colorMap[key] = `bg-${startColor}-400`;
        } else if (safeTiles.includes(key)) {
            cellContent = <SafeStar />;
        }

        boardCells.push(<Tile key={key} className={colorMap[cellType]}>{cellContent}</Tile>);
      }
    }
  }


  return (
    <div className="relative mx-auto aspect-square w-full max-w-[95vw] rounded-2xl bg-[#fefce8] p-2 shadow-lg sm:p-3 md:max-w-[500px] lg:max-w-[600px] border-4 border-yellow-800">
      <div className="grid h-full w-full grid-cols-15 grid-rows-15 gap-px">
        {boardCells}
      </div>
    </div>
  );
};
