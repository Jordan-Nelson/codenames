// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const Team = {
  "ID": "ID",
  "BLUE": "BLUE",
  "RED": "RED"
};

const CardType = {
  "ID": "ID",
  "BLUE": "BLUE",
  "RED": "RED",
  "NEUTRAL": "NEUTRAL",
  "DEATH": "DEATH"
};

const { Session, Board, Card } = initSchema(schema);

export {
  Session,
  Board,
  Team,
  CardType,
  Card
};