
import type { Player, PawnState, PlayerColor } from './types';

// Each tile is 100/15 = 6.666% of the board width/height
const TILE_SIZE = 100 / 15;

/**
 * Helper function to calculate the top/left CSS properties for a tile.
 * @param row The grid row (0-14).
 * @param col The grid column (0-14).
 * @returns CSS properties for positioning.
 */
const pos = (row: number, col: number) => ({
  top: `${row * TILE_SIZE}%`,
  left: `${col * TILE_SIZE}%`,
  width: `${TILE_SIZE}%`,
  height: `${TILE_SIZE}%`,
});

/**
 * Defines the four pawn positions within each player's home base.
 * These are styled to fit within the 2x2 grid in the LudoBoard component.
 */
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

/**
 * A static map of all 52 tiles on the main path, starting from Red's start.
 * Each entry corresponds to an absolute position on the board.
 */
const MAIN_PATH_COORDS = [
    // Path from Red's base
    pos(6, 1), pos(6, 2), pos(6, 3), pos(6, 4), pos(6, 5),
    pos(5, 6), pos(4, 6), pos(3, 6), pos(2, 6), pos(1, 6),
    pos(0, 6), pos(0, 7),
    // Path to Green's base
    pos(0, 8), pos(1, 8), pos(2, 8), pos(3, 8), pos(4, 8), pos(5, 8),
    pos(6, 9), pos(6, 10), pos(6, 11), pos(6, 12), pos(6, 13),
    pos(7, 14), pos(8, 14),
    // Path to Yellow's base
    pos(8, 13), pos(8, 12), pos(8, 11), pos(8, 10), pos(8, 9),
    pos(9, 8), pos(10, 8), pos(11, 8), pos(12, 8), pos(13, 8),
    pos(14, 8), pos(14, 7),
    // Path to Blue's base
    pos(14, 6), pos(13, 6), pos(12, 6), pos(11, 6), pos(10, 6), pos(9, 6),
    pos(8, 5), pos(8, 4), pos(8, 3), pos(8, 2), pos(8, 1),
    pos(7, 0),
    // Loop back to Red's start
    pos(6, 0)
];

/**
 * A static map of the 6 home-stretch tiles for each player.
 */
const HOME_PATH_COORDS: Record<PlayerColor, React.CSSProperties[]> = {
  red:    [pos(1, 7), pos(2, 7), pos(3, 7), pos(4, 7), pos(5, 7), pos(6, 7)],
  green:  [pos(7, 13), pos(7, 12), pos(7, 11), pos(7, 10), pos(7, 9), pos(7, 8)],
  yellow: [pos(13, 7), pos(12, 7), pos(11, 7), pos(10, 7), pos(9, 7), pos(8, 7)],
  blue:   [pos(7, 1), pos(7, 2), pos(7, 3), pos(7, 4), pos(7, 5), pos(7, 6)],
};

/**
 * Configuration for each player, including their starting position on the
 * main path and the location of safe tiles relative to their own path.
 */
export const PLAYER_CONFIG: Record<PlayerColor, { pathStart: number; safeTiles: number[] }> = {
  red:    { pathStart: 0,  safeTiles: [0, 8, 13, 21, 26, 34, 39, 47] },
  green:  { pathStart: 13, safeTiles: [0, 8, 13, 21, 26, 34, 39, 47] },
  yellow: { pathStart: 26, safeTiles: [0, 8, 13, 21, 26, 34, 39, 47] },
  blue:   { pathStart: 39, safeTiles: [0, 8, 13, 21, 26, 34, 39, 47] },
};

// The central finishing position for all pawns.
const FINISH_POSITION = {...pos(7, 7), transform: 'scale(0.8)'};

/**
 * Calculates the CSS style for a pawn based on its state.
 * This function is the single source of truth for pawn positioning.
 * @param player The player who owns the pawn.
 * @param pawn The pawn's state.
 * @returns CSS properties to position the pawn on the board.
 */
export function getPawnStyle(player: Player, pawn: PawnState): React.CSSProperties {
  // Case 1: Pawn is in the home base.
  if (pawn.position === -1) {
    // Pawn IDs are 1-4, array is 0-indexed.
    return BASE_POSITIONS[player.id][pawn.id - 1];
  }

  // Case 2: Pawn has finished the game.
  if (pawn.position === 57) {
     return FINISH_POSITION;
  }
  
  // Case 3: Pawn is on the final home stretch.
  // Home stretch positions are 51-56.
  if (pawn.position > 50) { 
    const homeIndex = pawn.position - 51; // Convert to 0-5 index
    if (homeIndex < HOME_PATH_COORDS[player.id].length) {
      return HOME_PATH_COORDS[player.id][homeIndex];
    }
  }

  // Case 4: Pawn is on the main path.
  // Main path positions are 0-50.
  if (pawn.position >= 0 && pawn.position <= 50) {
    const playerConfig = PLAYER_CONFIG[player.id];
    // Calculate the absolute index on the 52-tile main path.
    const globalPathIndex = (playerConfig.pathStart + pawn.position) % 52;
    return MAIN_PATH_COORDS[globalPathIndex];
  }

  // Fallback for any invalid state: hide the pawn.
  return { display: 'none' };
}
