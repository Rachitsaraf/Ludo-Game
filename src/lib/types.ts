export type Operator = '+' | '-' | 'Max' | 'Min';

export type PlayerColor = 'red' | 'green' | 'blue' | 'yellow';

export interface PawnState {
  id: number;
  position: number; // -1: base, 0-51: main path, 52-56: home run, 57: finished
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
