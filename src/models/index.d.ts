import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";

export enum Team {
  ID = "ID",
  BLUE = "BLUE",
  RED = "RED"
}

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

export declare class Session {
  readonly id: string;
  readonly displayName?: string;
  readonly lastActive?: string;
  readonly boardID?: string;
  readonly team?: Team | keyof typeof Team;
  readonly spy?: boolean;
  constructor(init: ModelInit<Session>);
  static copyOf(source: Session, mutator: (draft: MutableModel<Session>) => MutableModel<Session> | void): Session;
}

export declare class Board {
  readonly id: string;
  readonly name?: string;
  readonly cards?: (Card | null)[];
  readonly Sessions?: (Session | null)[];
  constructor(init: ModelInit<Board>);
  static copyOf(source: Board, mutator: (draft: MutableModel<Board>) => MutableModel<Board> | void): Board;
}