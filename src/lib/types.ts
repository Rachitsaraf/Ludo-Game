export type Operator = '+' | '-' | 'Max' | 'Min';

export type PlayerColor = 'red' | 'green' | 'blue' | 'yellow';

export interface PawnState {
  id: number;
  /**
   * Represents the pawn's state on the board.
   * -1: In the home base, not yet in play.
   * 0-50: On the main path, steps relative to the player's starting tile.
   * 51-56: On the final colored home stretch.
   * 57: Reached the center, finished the game.
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
  mathQuestion: { question: string; answer: number; options: number[] } | null;
  turnState: 'rolling' | 'answering' | 'moving' | 'game-over';
  winner: Player | null;
}
