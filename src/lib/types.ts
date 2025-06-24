
export type Operator = '+' | '-' | 'Max' | 'Min';

export type PlayerColor = 'red' | 'green' | 'blue' | 'yellow';

export interface PawnState {
  id: number;
  /**
   * Represents the pawn's position index on the board.
   * - -1: In the home base, not yet in play.
   * - 0-59: On the main path, steps relative to the player's starting tile.
   *   (e.g., 0 is the start tile, 59 is the last tile before turning home).
   * - 60-65: On the final colored home stretch (6 tiles).
   * - 66: Reached the center, finished the game for this pawn.
   */
  position: number;
}

export interface Player {
  id: PlayerColor;
  name: string;
  pawns: PawnState[];
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  dice: [number, Operator, number] | null;
  turnState: 'rolling' | 'selecting' | 'moving' | 'game-over';
  winner: Player | null;
}
