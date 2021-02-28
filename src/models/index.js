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

const { Board, Card } = initSchema(schema);

export {
  Board,
  Card,
  CardType
};