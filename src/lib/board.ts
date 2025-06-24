import type { Player, PawnState, PlayerColor } from './types';

const TILE_W_PERCENT = 100 / 15;

const pos = (row: number, col: number) => ({
  top: `${(row + 0.5) * TILE_W_PERCENT}%`,
  left: `${(col + 0.5) * TILE_W_PERCENT}%`,
});

const HOME_BASE_POSITIONS = {
  red:    [pos(1.5, 1.5), pos(1.5, 3.5), pos(3.5, 1.5), pos(3.5, 3.5)],
  green:  [pos(1.5, 10.5), pos(1.5, 12.5), pos(3.5, 10.5), pos(3.5, 12.5)],
  blue:   [pos(10.5, 1.5), pos(10.5, 3.5), pos(12.5, 1.5), pos(12.5, 3.5)],
  yellow: [pos(10.5, 10.5), pos(10.5, 12.5), pos(12.5, 10.5), pos(12.5, 12.5)],
};

const MAIN_PATH = [
    // Red to Green
    pos(6, 1), pos(6, 2), pos(6, 3), pos(6, 4), pos(6, 5),
    pos(5, 6), pos(4, 6), pos(3, 6), pos(2, 6), pos(1, 6),
    pos(0, 6), pos(0, 7),
    // Green entry
    pos(0, 8), pos(1, 8), pos(2, 8), pos(3, 8), pos(4, 8), pos(5, 8),
    pos(6, 9), pos(6, 10), pos(6, 11), pos(6, 12), pos(6, 13),
    pos(7, 14), pos(8, 14),
    // Yellow entry
    pos(8, 13), pos(8, 12), pos(8, 11), pos(8, 10), pos(8, 9),
    pos(9, 8), pos(10, 8), pos(11, 8), pos(12, 8), pos(13, 8),
    pos(14, 8), pos(14, 7),
    // Blue entry
    pos(14, 6), pos(13, 6), pos(12, 6), pos(11, 6), pos(10, 6), pos(9, 6),
    pos(8, 5), pos(8, 4), pos(8, 3), pos(8, 2), pos(8, 1),
    pos(7, 0), pos(6, 0),
    // Red entry
];

const HOME_PATHS = {
  red:    [pos(7, 1), pos(7, 2), pos(7, 3), pos(7, 4), pos(7, 5), pos(7, 6)],
  green:  [pos(1, 7), pos(2, 7), pos(3, 7), pos(4, 7), pos(5, 7), pos(6, 7)],
  blue:   [pos(13, 7), pos(12, 7), pos(11, 7), pos(10, 7), pos(9, 7), pos(8, 7)],
  yellow: [pos(7, 13), pos(7, 12), pos(7, 11), pos(7, 10), pos(7, 9), pos(7, 8)],
};

const createPlayerPath = (start: number) => {
    const path = [];
    for(let i=0; i<52; i++) {
        path.push((start + i) % 52);
    }
    return path;
}

export const PLAYER_CONFIG: Record<PlayerColor, { start: number; homeEntry: number; path: number[], safeTiles: number[] }> = {
  red:    { start: 0,  homeEntry: 51, path: createPlayerPath(0),  safeTiles: [0, 8, 13, 21, 26, 34, 39, 47] },
  green:  { start: 13, homeEntry: 12, path: createPlayerPath(13), safeTiles: [0, 8, 13, 21, 26, 34, 39, 47] },
  blue:   { start: 39, homeEntry: 38, path: createPlayerPath(39), safeTiles: [0, 8, 13, 21, 26, 34, 39, 47] },
  yellow: { start: 26, homeEntry: 25, path: createPlayerPath(26), safeTiles: [0, 8, 13, 21, 26, 34, 39, 47] },
};

const FINISH_POSITION = pos(7, 7);

export function getPawnStyle(player: Player, pawn: PawnState) {
  if (pawn.position === -1) { // In base
    return HOME_BASE_POSITIONS[player.id][pawn.id - 1];
  }
  if (pawn.position === 57) { // Finished
     return { ...FINISH_POSITION, transform: 'translate(-50%, -50%) scale(0.5)', opacity: 0.5 };
  }
  if (pawn.position > 50) { // Home run
    const homeIndex = pawn.position - 51;
    if (homeIndex < HOME_PATHS[player.id].length) {
      return { ...HOME_PATHS[player.id][homeIndex], transform: 'translate(-50%, -50%)' };
    }
  }
  if (pawn.position >= 0 && pawn.position <= 50) {
    const globalPathIndex = PLAYER_CONFIG[player.id].path[pawn.position];
    return { ...MAIN_PATH[globalPathIndex], transform: 'translate(-50%, -50%)' };
  }

  // Fallback, pawn is hidden
  return { display: 'none' };
}
