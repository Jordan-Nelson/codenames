// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

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
  CardType,
  Card
};