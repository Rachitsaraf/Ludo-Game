export type Operator = '+' | '-' | 'Max' | 'Min';

export type PlayerColor = 'red' | 'green' | 'blue' | 'yellow';

export interface PawnState {
  id: number;
  /**
   * -1: In base
   * 0-50: Main path (relative to player start)
   * 51-56: Home run
   * 57: Finished
   */
  position: number;
}

export interface Player {
  id: PlayerColor;
  name: string;
  color: string;
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
