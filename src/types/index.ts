export interface Task {
  id: string;
  name: string;
  duration: number; // in minutes
}

export interface Avatar {
  id: string;
  name: string;
  color: string;
  emoji: string;
}

export type GameState = 'setup' | 'playing' | 'break' | 'victory';