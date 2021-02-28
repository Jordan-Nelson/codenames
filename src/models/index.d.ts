import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";

export enum CardType {
  ID = "ID",
  BLUE = "BLUE",
  RED = "RED",
  NEUTRAL = "NEUTRAL",
  DEATH = "DEATH"
}



export declare class Board {
  readonly id: string;
  readonly name?: string;
  readonly Cards?: (Card | null)[];
  constructor(init: ModelInit<Board>);
  static copyOf(source: Board, mutator: (draft: MutableModel<Board>) => MutableModel<Board> | void): Board;
}

export declare class Card {
  readonly id: string;
  readonly value?: string;
  readonly flipped?: boolean;
  readonly type?: CardType | keyof typeof CardType;
  readonly boardID?: string;
  constructor(init: ModelInit<Card>);
  static copyOf(source: Card, mutator: (draft: MutableModel<Card>) => MutableModel<Card> | void): Card;
}