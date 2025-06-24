export type Operator = '+' | '-' | 'Max' | 'Min';

export interface Player {
  id: string;
  color: string;
  name: string;
  pawns: PawnState[];
}

export interface PawnState {
  id: number;
  position: number;
  state: 'base' | 'active' | 'finished';
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  dice: [number, Operator, number] | null;
  mathQuestion: { question: string; answer: number; options: number[] } | null;
  turnState: 'rolling' | 'answering' | 'moving' | 'game-over';
  winner: string | null;
}
