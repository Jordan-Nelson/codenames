import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";

export enum CardType {
  ID = "ID",
  BLUE = "BLUE",
  RED = "RED",
  NEUTRAL = "NEUTRAL",
  DEATH = "DEATH"
}

export declare class Card {
  readonly NewField?: string;
  readonly value?: string;
  readonly type?: CardType | keyof typeof CardType;
  readonly flipped?: boolean;
  constructor(init: ModelInit<Card>);
}

export declare class Board {
  readonly id: string;
  readonly name?: string;
  readonly cards?: (Card | null)[];
  readonly hasEnded?: boolean;
  constructor(init: ModelInit<Board>);
  static copyOf(source: Board, mutator: (draft: MutableModel<Board>) => MutableModel<Board> | void): Board;
}