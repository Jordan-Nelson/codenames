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

const { Card, Board } = initSchema(schema);

export {
  Card,
  Board,
  CardType
};