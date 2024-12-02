export interface Bird {
  x: number;
  y: number;
  velocity: number;
  width: number;
  height: number;
}

export interface Pipe {
  x: number;
  height: number;
}

export interface GameState {
  bird: Bird;
  pipes: Pipe[];
  score: number;
  gameOver: boolean;
}

export type MessageType = "INITIAL_STATE" | "FLAP" | "UPDATE" | "UPDATE_STATE";

export interface Message {
  type: MessageType;
  data?: any;
}
