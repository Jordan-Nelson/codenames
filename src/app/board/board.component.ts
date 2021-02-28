import { Component, OnInit } from '@angular/core';
import { BoardService } from '../board.service';
import { switchMap, take, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Board, Card, CardType } from 'src/models';
import { from, Observable } from 'rxjs';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { CardService } from '../card.service';

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
      return from(this.boardSerice.getBoard(params['id']));
    })
  );

  constructor(
    private boardSerice: BoardService,
    private cardService: CardService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {}

  onChange($event: MatSlideToggleChange) {
    this.isSpyMaster = $event.checked;
  }

  flipCard(board: Board) {
    console.log(board);
    return this.boardSerice.updateBoard(board);
    // if (this.isSpyMaster) {
    //   return;
    // }
    // return this.cardService.flipCard(card);
  }

  getColor(card: Card) {
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
