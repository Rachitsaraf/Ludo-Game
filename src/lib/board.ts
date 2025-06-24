
import type { Player, PawnState, PlayerColor } from './types';

// Each tile is 100/17 = 5.88% of the board width/height
const TILE_SIZE = 100 / 17;
// The pawn div is sized to match the tile size for easier positioning.
const PAWN_CONTAINER_SIZE_PERCENT = `${TILE_SIZE * 0.8}%`;

/**
 * Helper function to calculate the top/left CSS properties for the *center* of a tile.
 * This allows us to use transform to perfectly center the pawn element.
 * @param row The grid row (0-16).
 * @param col The grid column (0-16).
 * @returns CSS properties for positioning.
 */
const pos = (row: number, col: number) => ({
  top: `${(row + 0.5) * TILE_SIZE}%`,
  left: `${(col + 0.5) * TILE_SIZE}%`,
  width: PAWN_CONTAINER_SIZE_PERCENT,
  height: PAWN_CONTAINER_SIZE_PERCENT,
});


/**
 * Defines the center coordinates for the four pawn positions within each player's home base.
 */
const BASE_POSITIONS: Record<PlayerColor, React.CSSProperties[]> = {
    red:    [pos(2, 2), pos(2, 5), pos(5, 2), pos(5, 5)],
    green:  [pos(2, 11), pos(2, 14), pos(5, 11), pos(5, 14)],
    blue:   [pos(11, 2), pos(11, 5), pos(14, 2), pos(14, 5)],
    yellow: [pos(11, 11), pos(11, 14), pos(14, 11), pos(14, 14)],
};

/**
 * A static map of all 60 tiles on the main path.
 */
const MAIN_PATH_COORDS = [
    // Red's path segment (0-14)
    pos(7, 1), pos(7, 2), pos(7, 3), pos(7, 4), pos(7, 5), pos(7, 6),
    pos(6, 7), pos(5, 7), pos(4, 7), pos(3, 7), pos(2, 7), pos(1, 7),
    pos(0, 7), pos(0, 8), pos(0, 9),
    // Green's path segment (15-29)
    pos(1, 9), pos(2, 9), pos(3, 9), pos(4, 9), pos(5, 9), pos(6, 9),
    pos(7, 10), pos(7, 11), pos(7, 12), pos(7, 13), pos(7, 14), pos(7, 15),
    pos(7, 16), pos(8, 16), pos(9, 16),
    // Yellow's path segment (30-44)
    pos(9, 15), pos(9, 14), pos(9, 13), pos(9, 12), pos(9, 11), pos(9, 10),
    pos(10, 9), pos(11, 9), pos(12, 9), pos(13, 9), pos(14, 9), pos(15, 9),
    pos(16, 9), pos(16, 8), pos(16, 7),
    // Blue's path segment (45-59)
    pos(15, 7), pos(14, 7), pos(13, 7), pos(12, 7), pos(11, 7), pos(10, 7),
    pos(9, 6), pos(9, 5), pos(9, 4), pos(9, 3), pos(9, 2), pos(9, 1),
    pos(9, 0), pos(8, 0), pos(7, 0),
];


/**
 * A static map of the 6 home-stretch tiles for each player.
 */
const HOME_PATH_COORDS: Record<PlayerColor, React.CSSProperties[]> = {
  red:    [pos(8, 1), pos(8, 2), pos(8, 3), pos(8, 4), pos(8, 5), pos(8, 6)],
  green:  [pos(1, 8), pos(2, 8), pos(3, 8), pos(4, 8), pos(5, 8), pos(6, 8)],
  yellow: [pos(8, 15), pos(8, 14), pos(8, 13), pos(8, 12), pos(8, 11), pos(8, 10)],
  blue:   [pos(15, 8), pos(14, 8), pos(13, 8), pos(12, 8), pos(11, 8), pos(10, 8)],
};


/**
 * Configuration for each player, including their starting position on the
 * main path.
 */
export const PLAYER_CONFIG: Record<PlayerColor, { pathStart: number; }> = {
  red:    { pathStart: 0 },
  green:  { pathStart: 15 },
  yellow: { pathStart: 30 },
  blue:   { pathStart: 45 },
};

// The central finishing position for all pawns.
const FINISH_POSITION = pos(8, 8);

/**
 * Calculates the CSS style for a pawn based on its state.
 * This function is the single source of truth for pawn positioning.
 * It calculates the center of the target tile and uses a CSS transform
 * to ensure the pawn is always centered.
 * @param player The player who owns the pawn.
 * @param pawn The pawn's state.
 * @returns CSS properties to position the pawn on the board.
 */
export function getPawnStyle(player: Player, pawn: PawnState): React.CSSProperties {
  let style: React.CSSProperties;

  // Case 1: Pawn is in the home base.
  if (pawn.position === -1) {
    // Pawn IDs are 1-4, array is 0-indexed.
    style = BASE_POSITIONS[player.id][pawn.id - 1];
  }
  // Case 2: Pawn has finished the game.
  else if (pawn.position === 66) {
     style = FINISH_POSITION;
  }
  // Case 3: Pawn is on the final home stretch.
  // Home stretch positions are 60-65.
  else if (pawn.position > 59) { 
    const homeIndex = pawn.position - 60; // Convert to 0-5 index
    style = HOME_PATH_COORDS[player.id][homeIndex] ?? { display: 'none' };
  }
  // Case 4: Pawn is on the main path.
  // Main path positions are 0-59.
  else if (pawn.position >= 0 && pawn.position < 60) {
    const playerConfig = PLAYER_CONFIG[player.id];
    // Calculate the absolute index on the 60-tile main path.
    const globalPathIndex = (playerConfig.pathStart + pawn.position) % 60;
    style = MAIN_PATH_COORDS[globalPathIndex] ?? { display: 'none' };
  }
  // Fallback for any invalid state: hide the pawn.
  else {
    style = { display: 'none' };
  }

  return { ...style, transform: 'translate(-50%, -50%)' };
}
