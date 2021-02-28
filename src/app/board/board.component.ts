import { Component, OnInit } from '@angular/core';
import { BoardService } from '../board.service';
import { map, switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Board, Card, CardType } from 'src/models';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CopySnackBarComponent } from '../copy-snack-bar/copy-snack-bar.component';

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

  hasGameEnded$ = this.board$.pipe(
    map((board) => this.boardSerice.hasGameEnded(board))
  );

  constructor(
    private boardSerice: BoardService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  onChange($event: MatSlideToggleChange) {
    this.isSpyMaster = $event.checked;
  }

  changePlayer() {
    this.isSpyMaster = false;
  }

  changeSpyMaster() {
    this.isSpyMaster = true;
  }

  flipCard(board: Board, value: string, hasGameEnded: boolean) {
    if (this.isSpyMaster || hasGameEnded) {
      return;
    }
    return this.boardSerice.flipCard(board, value);
  }

  newGame(board: Board) {
    if (confirm('Are you sure you start a new game?')) {
      return this.boardSerice.refreshBoard(board);
    }
  }

  copy() {
    var dummy = document.createElement('input'),
      text = window.location.href;

    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);

    this._snackBar.openFromComponent(CopySnackBarComponent, {
      duration: 2000,
    });
  }

  getColor(card: Card, hasGameEnded: boolean) {
    if (card.flipped) {
      return 'white';
    }
    if (!this.isSpyMaster || hasGameEnded) {
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

  getBackgroundColor(card: Card, hasGameEnded: boolean) {
    if (card.flipped) {
      switch (card.type) {
        case CardType.BLUE:
          return 'blue';
        case CardType.RED:
          return 'red';
        case CardType.NEUTRAL:
          return 'BurlyWood';
        case CardType.DEATH:
          return 'black';
      }
    }
    if (hasGameEnded) {
      switch (card.type) {
        case CardType.BLUE:
          return 'lightblue';
        case CardType.RED:
          return 'pink';
        case CardType.NEUTRAL:
          return 'lightgray';
        case CardType.DEATH:
          return 'darkgrey';
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
