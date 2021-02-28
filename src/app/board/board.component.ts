import { Component, OnInit } from '@angular/core';
import { BoardService } from '../board.service';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Board, Card, CardType } from 'src/models';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  isSpyMaster = false;
  board$ = this.route.params.pipe(
    switchMap((params) => {
      console.log(params);
      return this.boardSerice.getBoard$(params['id']);
    })
  );

  constructor(
    private boardSerice: BoardService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {}

  onChange($event: MatSlideToggleChange) {
    this.isSpyMaster = $event.checked;
  }

  flipCard(board: Board, value: string) {
    if (this.isSpyMaster) {
      return;
    }
    return this.boardSerice.updateBoard(board, value);
  }

  getColor(card: Card) {
    if (card.flipped) {
      return 'white';
    }
    if (!this.isSpyMaster) {
      return 'black';
    }
    switch (card.type) {
      case CardType.BLUE:
        return 'blue';
      case CardType.RED:
        return 'red';
      case CardType.NEUTRAL:
        return 'black';
      case CardType.DEATH:
        return 'black';
    }
  }

  getBackgroundColor(card: Card) {
    if (card.flipped) {
      switch (card.type) {
        case CardType.BLUE:
          return 'blue';
        case CardType.RED:
          return 'red';
        case CardType.NEUTRAL:
          return 'tan';
        case CardType.DEATH:
          return 'black';
      }
    }
    if (!this.isSpyMaster) {
      return 'lightgray';
    }
    switch (card.type) {
      case CardType.BLUE:
        return 'lightgray';
      case CardType.RED:
        return 'lightgray';
      case CardType.NEUTRAL:
        return 'lightgray';
      case CardType.DEATH:
        return 'darkgrey';
    }
  }
}
