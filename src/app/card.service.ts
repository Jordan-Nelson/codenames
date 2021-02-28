import { Injectable } from '@angular/core';
import { DataStore } from '@aws-amplify/datastore';
import { Card } from '../models';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  constructor() {}

  async flipCard(card: Card) {
    // const original = await DataStore.query(Card, card.id);
    // console.log(card);
    return DataStore.save(
      Card.copyOf(card, (item) => {
        // item.boardID = card.boardID;
        // item.type = card.type;
        // item.value = card.value;
        item.flipped = true;
      })
    );
  }
}
