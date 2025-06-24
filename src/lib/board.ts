import type { Player, PawnState, PlayerColor } from './types';

// Each tile is 100/15 = 6.66% of the board width/height
const TILE_SIZE = 100 / 15;

const pos = (row: number, col: number) => ({
  top: `${row * TILE_SIZE}%`,
  left: `${col * TILE_SIZE}%`,
  width: `${TILE_SIZE}%`,
  height: `${TILE_SIZE}%`,
});

const BASE_POSITIONS: Record<PlayerColor, React.CSSProperties[]> = {
  red: [
    { top: '10%', left: '10%' }, { top: '10%', left: '23.33%' },
    { top: '23.33%', left: '10%' }, { top: '23.33%', left: '23.33%' }
  ].map(p => ({...p, width: '6.67%', height: '6.67%'})),
  green: [
    { top: '10%', left: '63.33%' }, { top: '10%', left: '76.66%' },
    { top: '23.33%', left: '63.33%' }, { top: '23.33%', left: '76.66%' }
  ].map(p => ({...p, width: '6.67%', height: '6.67%'})),
  blue: [
    { top: '63.33%', left: '10%' }, { top: '63.33%', left: '23.33%' },
    { top: '76.66%', left: '10%' }, { top: '76.66%', left: '23.33%' }
  ].map(p => ({...p, width: '6.67%', height: '6.67%'})),
  yellow: [
    { top: '63.33%', left: '63.33%' }, { top: '63.33%', left: '76.66%' },
    { top: '76.66%', left: '63.33%' }, { top: '76.66%', left: '76.66%' }
  ].map(p => ({...p, width: '6.67%', height: '6.67%'})),
};


const MAIN_PATH_COORDS = [
    // Path from red start to green corner
    pos(6, 1), pos(6, 2), pos(6, 3), pos(6, 4), pos(6, 5),
    pos(5, 6), pos(4, 6), pos(3, 6), pos(2, 6), pos(1, 6),
    pos(0, 6), pos(0, 7), pos(0, 8),
    // Path from green start to yellow corner
    pos(1, 8), pos(2, 8), pos(3, 8), pos(4, 8), pos(5, 8),
    pos(6, 9), pos(6, 10), pos(6, 11), pos(6, 12), pos(6, 13),
    pos(7, 14), pos(8, 14), pos(8, 13),
    // Path from yellow start to blue corner
    pos(8, 12), pos(8, 11), pos(8, 10), pos(8, 9),
    pos(9, 8), pos(10, 8), pos(11, 8), pos(12, 8), pos(13, 8),
    pos(14, 8), pos(14, 7), pos(14, 6),
    // Path from blue start to red corner
    pos(13, 6), pos(12, 6), pos(11, 6), pos(10, 6), pos(9, 6),
    pos(8, 5), pos(8, 4), pos(8, 3), pos(8, 2), pos(8, 1),
    pos(7, 0), pos(6, 0),
];

const HOME_PATH_COORDS: Record<PlayerColor, React.CSSProperties[]> = {
  red:    [pos(1, 7), pos(2, 7), pos(3, 7), pos(4, 7), pos(5, 7), pos(6, 7)],
  green:  [pos(7, 9), pos(7, 10), pos(7, 11), pos(7, 12), pos(7, 13), pos(7, 14)],
  blue:   [pos(9, 7), pos(10, 7), pos(11, 7), pos(12, 7), pos(13, 7), pos(14, 7)],
  yellow: [pos(7, 5), pos(7, 4), pos(7, 3), pos(7, 2), pos(7, 1), pos(7, 0)],
};

// Re-map yellow home path from image.
HOME_PATH_COORDS.yellow = [pos(9, 7), pos(10, 7), pos(11, 7), pos(12, 7), pos(13, 7)];
HOME_PATH_COORDS.blue = [pos(7, 1), pos(7, 2), pos(7, 3), pos(7, 4), pos(7, 5)];
HOME_PATH_COORDS.yellow = [pos(13, 7), pos(12, 7), pos(11, 7), pos(10, 7), pos(9, 7)];

// Re-map from visual inspection of board image
HOME_PATH_COORDS.red = [pos(6, 7), pos(5, 7), pos(4, 7), pos(3, 7), pos(2, 7), pos(1, 7)];
HOME_PATH_COORDS.green = [pos(7, 8), pos(7, 9), pos(7, 10), pos(7, 11), pos(7, 12), pos(7, 13)];
HOME_PATH_COORDS.blue = [pos(8, 7), pos(9, 7), pos(10, 7), pos(11, 7), pos(12, 7), pos(13, 7)]; // This seems wrong
HOME_PATH_COORDS.yellow = [pos(7, 6), pos(7, 5), pos(7, 4), pos(7, 3), pos(7, 2), pos(7, 1)]; // This seems wrong

// Corrected based on standard ludo
HOME_PATH_COORDS.red =    [pos(1, 7), pos(2, 7), pos(3, 7), pos(4, 7), pos(5, 7), pos(6, 7)];
HOME_PATH_COORDS.green =  [pos(7, 9), pos(7, 10), pos(7, 11), pos(7, 12), pos(7, 13), pos(7, 14)];
// The below were swapped and pointing wrong direction in old config
HOME_PATH_COORDS.yellow = [pos(13, 7), pos(12, 7), pos(11, 7), pos(10, 7), pos(9, 7), pos(8, 7)];
HOME_PATH_COORDS.blue =   [pos(7, 1), pos(7, 2), pos(7, 3), pos(7, 4), pos(7, 5), pos(6, 5)]; // last step wrong
HOME_PATH_COORDS.blue =   [pos(7, 1), pos(7, 2), pos(7, 3), pos(7, 4), pos(7, 5), pos(7, 6)];

export const PLAYER_CONFIG: Record<PlayerColor, { homeEntry: number; pathStart: number; safeTiles: number[] }> = {
  red:    { homeEntry: 50, pathStart: 0,  safeTiles: [8, 21, 34, 47] },
  green:  { homeEntry: 11, pathStart: 13, safeTiles: [8, 21, 34, 47] },
  yellow: { homeEntry: 24, pathStart: 26, safeTiles: [8, 21, 34, 47] },
  blue:   { homeEntry: 37, pathStart: 39, safeTiles: [8, 21, 34, 47] },
};

const FINISH_POSITION = pos(7, 7);

export function getPawnStyle(player: Player, pawn: PawnState): React.CSSProperties {
  if (pawn.position === -1) { // In base
    return { ...BASE_POSITIONS[player.id][pawn.id - 1] };
  }
  if (pawn.position === 57) { // Finished
     return { ...FINISH_POSITION, transform: 'scale(0.5)', opacity: 0.5 };
  }
  
  const playerConfig = PLAYER_CONFIG[player.id];
  
  // Home run
  if (pawn.position > 50) { 
    const homeIndex = pawn.position - 51;
    if (homeIndex < HOME_PATH_COORDS[player.id].length) {
      return HOME_PATH_COORDS[player.id][homeIndex];
    }
  }

  // Main path
  if (pawn.position >= 0 && pawn.position <= 50) {
    const globalPathIndex = (playerConfig.pathStart + pawn.position) % 52;
    return MAIN_PATH_COORDS[globalPathIndex];
  }

  // Fallback, pawn is hidden
  return { display: 'none' };
}
