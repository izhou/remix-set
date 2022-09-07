export interface PuzzleGameState {
  numSolutions: number,
  errorMessage?:string,
  history: Array<string>
  isEnded: boolean,
}

export interface StandardGameState {
  currentCards: Array<CardData | null>,
  deck: Array<CardData>,
  isEnded: boolean,
  tableEntries: Array<Set>,
  errorMessage?: string
}

export enum CardNumbers {
  One=1,
  Two,
  Three
}

export enum CardShapes {
  Squiggle="squiggle",
  Oval="oval",
  Diamond="diamond"
}

export enum CardFills {
  Solid="solid",
  Empty="empty",
  Striped="striped",
}

export enum CardColors {
  Red="red",
  Green="green",
  Blue="blue"
}

export interface CardData {
  number: CardNumbers;
  shape: CardShapes;
  fill: CardFills;
  color: CardColors;
}

export type Set = [CardData, CardData, CardData];
export type SetIndex = [number, number, number];