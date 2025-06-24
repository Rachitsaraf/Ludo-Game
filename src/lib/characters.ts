import type { PlayerColor } from './types';

export interface Character {
  name: string;
  image: string;
}

export const CHARACTER_DATA: Record<PlayerColor, Character> = {
  red: {
    name: 'Chhota Bheem',
    image: 'https://placehold.co/80x80.png',
  },
  green: {
    name: 'Doraemon',
    image: 'https://placehold.co/80x80.png',
  },
  blue: {
    name: 'Pikachu',
    image: 'https://placehold.co/80x80.png',
  },
  yellow: {
    name: 'Shinchan',
    image: 'https://placehold.co/80x80.png',
  },
};

export const CHARACTER_HINTS: Record<PlayerColor, string> = {
    red: "Chhota Bheem",
    green: "Doraemon",
    blue: "Pikachu pokemon",
    yellow: "Shinchan"
}
