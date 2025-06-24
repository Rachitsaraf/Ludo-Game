import type { Player, PawnState, PlayerColor } from './types';

const TILE_W_PERCENT = 100 / 15;

const pos = (row: number, col: number) => ({
  top: `${row * TILE_W_PERCENT}%`,
  left: `${col * TILE_W_PERCENT}%`,
});

const HOME_BASE_POSITIONS = {
  red:    [pos(1,1), pos(1,4), pos(4,1), pos(4,4)],
  blue:   [pos(1,10), pos(1,13), pos(4,10), pos(4,13)],
  green:  [pos(10,1), pos(10,4), pos(13,1), pos(13,4)],
  yellow: [pos(10,10), pos(10,13), pos(13,10), pos(13,13)],
};

const PATH_COORDINATES = [
  // Path starting from right of Red's base
  pos(6, 1), pos(6, 2), pos(6, 3), pos(6, 4), pos(6, 5),
  pos(5, 6), pos(4, 6), pos(3, 6), pos(2, 6), pos(1, 6),
  pos(0, 6), // Turn
  pos(0, 7), pos(0, 8),
  pos(1, 8), pos(2, 8), pos(3, 8), pos(4, 8), pos(5, 8),
  pos(6, 9), pos(6, 10), pos(6, 11), pos(6, 12), pos(6, 13),
  pos(6, 14), // Turn
  pos(7, 14), pos(8, 14),
  pos(8, 13), pos(8, 12), pos(8, 11), pos(8, 10), pos(8, 9),
  pos(9, 8), pos(10, 8), pos(11, 8), pos(12, 8), pos(13, 8),
  pos(14, 8), // Turn
  pos(14, 7), pos(14, 6),
  pos(13, 6), pos(12, 6), pos(11, 6), pos(10, 6), pos(9, 6),
  pos(8, 5), pos(8, 4), pos(8, 3), pos(8, 2), pos(8, 1),
  pos(8, 0), // Turn
  pos(7, 0),
];

const HOME_PATH_COORDINATES = {
  red:    [pos(7, 1), pos(7, 2), pos(7, 3), pos(7, 4), pos(7, 5), pos(7,6)],
  blue:   [pos(1, 7), pos(2, 7), pos(3, 7), pos(4, 7), pos(5, 7), pos(6,7)],
  green:  [pos(13, 7), pos(12, 7), pos(11, 7), pos(10, 7), pos(9, 7), pos(8,7)],
  yellow: [pos(7, 13), pos(7, 12), pos(7, 11), pos(7, 10), pos(7, 9), pos(8,7)],
};

export const PLAYER_CONFIG: Record<PlayerColor, { start: number; homeEntry: number; safeTiles: number[] }> = {
  red:    { start: 0, homeEntry: 50, safeTiles: [0] },
  blue:   { start: 13, homeEntry: 11, safeTiles: [13] },
  green:  { start: 26, homeEntry: 24, safeTiles: [26] },
  yellow: { start: 39, homeEntry: 37, safeTiles: [39] },
};

export function getPawnStyle(player: Player, pawn: PawnState) {
  if (pawn.position === -1) { // In base
    return HOME_BASE_POSITIONS[player.id][pawn.id - 1];
  }
  if (pawn.position >= 52) { // Home run
    const homeIndex = pawn.position - 52;
    if(homeIndex < HOME_PATH_COORDINATES[player.id].length) {
      return HOME_PATH_COORDINATES[player.id][homeIndex];
    }
  }
   if (pawn.position < PATH_COORDINATES.length) {
    const mainPathIndex = (PLAYER_CONFIG[player.id].start + pawn.position) % 52;
    return PATH_COORDINATES[mainPathIndex];
  }

  // Finished or default
  return { display: 'none' };
}
