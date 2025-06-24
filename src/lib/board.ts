
import type { Player, PawnState, PlayerColor } from './types';

// Each tile is 100/15 = 6.666% of the board width/height
const TILE_SIZE = 100 / 15;
// The pawn div is sized to match the tile size for easier positioning.
const PAWN_CONTAINER_SIZE_PERCENT = `${TILE_SIZE * 0.8}%`;

/**
 * Helper function to calculate the top/left CSS properties for the *center* of a tile.
 * This allows us to use transform to perfectly center the pawn element.
 * @param row The grid row (0-14).
 * @param col The grid column (0-14).
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
    red:    [pos(1.5, 1.5), pos(1.5, 4.5), pos(4.5, 1.5), pos(4.5, 4.5)],
    green:  [pos(1.5, 10.5), pos(1.5, 13.5), pos(4.5, 10.5), pos(4.5, 13.5)],
    blue:   [pos(10.5, 1.5), pos(10.5, 4.5), pos(13.5, 1.5), pos(13.5, 4.5)],
    yellow: [pos(10.5, 10.5), pos(10.5, 13.5), pos(13.5, 10.5), pos(13.5, 13.5)],
};

/**
 * A static map of all 52 tiles on the main path, starting from Red's start.
 * Each entry corresponds to an absolute position on the board.
 * The path is defined in 13-tile segments, from one player's start to the next.
 */
const MAIN_PATH_COORDS = [
    // Red's path segment (0-12)
    pos(6, 1), pos(6, 2), pos(6, 3), pos(6, 4), pos(6, 5),
    pos(5, 6), pos(4, 6), pos(3, 6), pos(2, 6), pos(1, 6),
    pos(0, 6), pos(0, 7), pos(0, 8),
    // Green's path segment (13-25)
    pos(1, 8), pos(2, 8), pos(3, 8), pos(4, 8), pos(5, 8),
    pos(6, 9), pos(6, 10), pos(6, 11), pos(6, 12), pos(6, 13),
    pos(6, 14), pos(7, 14), pos(8, 14),
    // Yellow's path segment (26-38)
    pos(8, 13), pos(8, 12), pos(8, 11), pos(8, 10), pos(8, 9),
    pos(9, 8), pos(10, 8), pos(11, 8), pos(12, 8), pos(13, 8),
    pos(14, 8), pos(14, 7), pos(14, 6),
    // Blue's path segment (39-51)
    pos(13, 6), pos(12, 6), pos(11, 6), pos(10, 6), pos(9, 6),
    pos(8, 5), pos(8, 4), pos(8, 3), pos(8, 2), pos(8, 1),
    pos(8, 0), pos(7, 0), pos(6, 0),
];


/**
 * A static map of the 6 home-stretch tiles for each player.
 */
const HOME_PATH_COORDS: Record<PlayerColor, React.CSSProperties[]> = {
  red:    [pos(7, 1), pos(7, 2), pos(7, 3), pos(7, 4), pos(7, 5), pos(7, 6)],
  green:  [pos(1, 7), pos(2, 7), pos(3, 7), pos(4, 7), pos(5, 7), pos(6, 7)],
  yellow: [pos(7, 13), pos(7, 12), pos(7, 11), pos(7, 10), pos(7, 9), pos(7, 8)],
  blue:   [pos(13, 7), pos(12, 7), pos(11, 7), pos(10, 7), pos(9, 7), pos(8, 7)],
};


/**
 * Configuration for each player, including their starting position on the
 * main path.
 */
export const PLAYER_CONFIG: Record<PlayerColor, { pathStart: number; }> = {
  red:    { pathStart: 0 },
  green:  { pathStart: 13 },
  yellow: { pathStart: 26 },
  blue:   { pathStart: 39 },
};

// The central finishing position for all pawns.
const FINISH_POSITION = pos(7.5, 7.5);

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
  else if (pawn.position === 57) {
     style = FINISH_POSITION;
  }
  // Case 3: Pawn is on the final home stretch.
  // Home stretch positions are 51-56.
  else if (pawn.position > 50) { 
    const homeIndex = pawn.position - 51; // Convert to 0-5 index
    style = HOME_PATH_COORDS[player.id][homeIndex] ?? { display: 'none' };
  }
  // Case 4: Pawn is on the main path.
  // Main path positions are 0-50.
  else if (pawn.position >= 0 && pawn.position <= 50) {
    const playerConfig = PLAYER_CONFIG[player.id];
    // Calculate the absolute index on the 52-tile main path.
    const globalPathIndex = (playerConfig.pathStart + pawn.position) % 52;
    style = MAIN_PATH_COORDS[globalPathIndex] ?? { display: 'none' };
  }
  // Fallback for any invalid state: hide the pawn.
  else {
    style = { display: 'none' };
  }

  return { ...style, transform: 'translate(-50%, -50%)' };
}
