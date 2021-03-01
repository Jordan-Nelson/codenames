import { Injectable } from '@angular/core';
import { DataStore } from '@aws-amplify/datastore';
import { Observable } from 'rxjs';
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
            index <= 7
              ? CardType.BLUE
              : index <= 16
              ? CardType.RED
              : index <= 23
              ? CardType.NEUTRAL
              : CardType.DEATH,
          value: word,
          flipped: false,
        })
    );
    shuffle(cards);
    return cards;
  }

  constructor() {}

  hasGameEnded(board: Board): boolean {
    const blueCards = board.cards.filter((card) => card.type === CardType.BLUE);
    const redCards = board.cards.filter((card) => card.type === CardType.RED);
    const deathCard = board.cards.find((card) => card.type === CardType.DEATH);
    if (deathCard.flipped) {
      return true;
    }
    if (blueCards.every((card) => card.flipped)) {
      return true;
    }
    if (redCards.every((card) => card.flipped)) {
      return true;
    }
    return false;
  }

  createBoard(name: string): Promise<Board> {
    return DataStore.save(
      new Board({
        name,
        cards: this.generateCards(),
      })
    );
  }

  getBoard(id: string): Promise<Board> {
    return DataStore.query(Board, id);
  }

  getBoard$(id: string) {
    const observable = new Observable<Board>((subscriber) => {
      this.getBoard(id).then((board) => {
        subscriber.next(board);
        DataStore.observe(Board, id).subscribe((value) => {
          subscriber.next(value.element);
        });
      });
    });
    return observable;
  }

  observeBoard(id: string) {
    return DataStore.observe(Board, id);
  }

  async flipCard(board: Board, valueOfCardToFlip: string) {
    const original = await DataStore.query(Board, board.id);
    const newCards = original.cards.map((card) => {
      if (card.value === valueOfCardToFlip) {
        return new Card({
          flipped: true,
          type: card.type,
          value: card.value,
        });
      }
      return card;
    });
    return DataStore.save(
      Board.copyOf(original, (item) => {
        item.cards = newCards;
      })
    );
  }

  async refreshBoard(board: Board) {
    const original = await DataStore.query(Board, board.id);
    return DataStore.save(
      Board.copyOf(original, (item) => {
        item.cards = this.generateCards();
      })
    );
  }
}
