import { Component, OnInit } from '@angular/core';
import { BoardService } from '../board.service';
import { map, shareReplay, switchMap, take } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Board, Card, CardType, Session, Team } from 'src/models';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CopySnackBarComponent } from '../copy-snack-bar/copy-snack-bar.component';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  isSpyMaster = false;
  boardId$ = this.route.params.pipe(
    map((params) => {
      return params['id'];
    })
  );
  board$ = this.boardId$.pipe(
    switchMap((id) => {
      return this.boardSerice.getBoard$(id);
    }),
    shareReplay()
  );

  sessions$ = this.boardId$.pipe(
    switchMap((id) => {
      return this.sessionService.getSessions$(id);
    })
  );

  redTeam$ = this.sessions$.pipe(
    map((sessions) => sessions.filter((session) => session.team === Team.RED))
  );
  blueTeam$ = this.sessions$.pipe(
    map((sessions) => sessions.filter((session) => session.team === Team.BLUE))
  );

  team$ = this.sessions$.pipe(
    map((sessions) => {
      const sessionId = this.sessionService.getSessionId();
      const session = sessions.find(
        (currentSession) => currentSession.id === sessionId
      );
      return session.team;
    })
  );

  teamColor$ = this.team$.pipe(
    map((team) =>
      team === Team.BLUE ? 'RoyalBlue' : team === Team.RED ? 'Red' : 'lightgrey'
    )
  );

  hasGameEnded$ = this.board$.pipe(
    map((board) => this.boardSerice.hasGameEnded(board))
  );

  numberOfBlueCards$ = this.board$.pipe(
    map(
      (board) =>
        board.cards.filter(
          (card) => card.type === CardType.BLUE && !card.flipped
        ).length
    )
  );

  numberOfRedCards$ = this.board$.pipe(
    map(
      (board) =>
        board.cards.filter(
          (card) => card.type === CardType.RED && !card.flipped
        ).length
    )
  );

  private updateSessionLastActive() {
    return this.boardId$
      .pipe(
        switchMap((id) => {
          return this.sessionService.updateSessionLastActive(id);
        }),
        take(1)
      )
      .subscribe();
  }

  private joinBoard() {
    return this.boardId$
      .pipe(
        switchMap((id) => {
          return this.sessionService.joinBoard(id);
        }),
        take(1)
      )
      .subscribe();
  }

  constructor(
    private boardSerice: BoardService,
    private sessionService: SessionService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.joinBoard();
    setInterval(() => {
      this.updateSessionLastActive();
    }, 15000);
  }

  changeTeam(session: Session) {
    this.sessionService.changeTeam(session);
  }

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
        return 'RoyalBlue';
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
          return 'RoyalBlue';
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
