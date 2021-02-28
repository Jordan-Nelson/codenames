import { Injectable } from '@angular/core';
import { DataStore } from '@aws-amplify/datastore';
import { Board, Card, CardType } from '../models';
import { WORDS } from './words.constants';

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function getRandom(words: string[], n: number) {
  var result = new Array(n),
    len = words.length,
    taken = new Array(len);
  if (n > len)
    throw new RangeError('getRandom: more elements taken than available');
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = words[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private generateCards(): Card[] {
    const cards = getRandom(WORDS, 25).map(
      (word, index) =>
        new Card({
          type:
            index <= 8
              ? CardType.BLUE
              : index <= 17
              ? CardType.RED
              : index <= 23
              ? CardType.NEUTRAL
              : CardType.DEATH,
          value: word,
        })
    );
    shuffle(cards);
    return cards;
  }

  constructor() {}

  createBoard(name: string): Promise<Board> {
    return DataStore.save(
      new Board({
        name,
        Cards: this.generateCards(),
      })
    );
  }

  getBoard(id: string): Promise<Board> {
    return DataStore.query(Board, id);
  }
}
