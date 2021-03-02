import { Injectable } from '@angular/core';
import { DataStore } from 'aws-amplify';
import { BehaviorSubject, Observable } from 'rxjs';
import { Session, Team } from '../models';

function generateRandomNumber(): number {
  return Math.floor(1000 + Math.random() * 9000);
}

function lastAvtiveMinimumDate() {
  return new Date(new Date().getTime() - 45000);
}

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  storage = window.localStorage;

  displayName$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor() {}

  getSessionId() {
    return localStorage.getItem('sessionId');
  }

  setSessionId(id: string) {
    localStorage.setItem('sessionId', id);
  }

  async joinBoard(boardId: string): Promise<Session> {
    const session = await this.getSession();
    if (session && session.boardID === boardId) {
      return this.updateSessionLastActive(boardId, { spy: false });
    } else if (session) {
      return this.addSessionToBoard(boardId, session);
    }

    return this.createSession(boardId);
  }

  addSessionToBoard(boardId: string, session: Session) {
    return DataStore.save(
      Session.copyOf(session, (item) => {
        item.lastActive = new Date().toISOString();
        item.boardID = boardId;
        item.spy = false;
      })
    );
  }

  createSession(boardId: string): Promise<Session> {
    const username = 'User' + generateRandomNumber();
    const displayName =
      window.prompt('Enter a display name', username) || username;
    this.displayName$.next(displayName);
    const team = Math.floor(Math.random() * 2) == 0 ? Team.RED : Team.BLUE;
    return DataStore.save(
      new Session({
        displayName,
        lastActive: new Date().toISOString(),
        team,
        boardID: boardId,
      })
    ).then((session) => {
      this.setSessionId(session.id);
      return session;
    });
  }

  async getSession(): Promise<Session> {
    const sessionId = this.getSessionId();
    if (!sessionId) {
      return null;
    }
    const session = await DataStore.query(Session, sessionId);
    this.displayName$.next(session.displayName);
    return session;
  }

  async updateSessionLastActive(
    boardId: string,
    session: Partial<Session> = {}
  ): Promise<Session> {
    const currentSession = await this.getSession();
    return DataStore.save(
      Session.copyOf(currentSession, (item) => {
        item.lastActive = new Date().toISOString();
        item.boardID = boardId;
        if (session.spy !== null) {
          item.spy = session.spy;
        }
      })
    );
  }

  changeTeam(session: Session) {
    return DataStore.save(
      Session.copyOf(session, (item) => {
        item.team = session.team === Team.RED ? Team.BLUE : Team.RED;
      })
    );
  }

  async changeDisplayName() {
    const newDisplayName = window.prompt('Enter a new display name');
    if (!newDisplayName) {
      return;
    }
    const currentSession = await this.getSession();
    return DataStore.save(
      Session.copyOf(currentSession, (item) => {
        item.displayName = newDisplayName;
      })
    ).then(() => {
      this.displayName$.next(newDisplayName);
    });
  }

  async changeSpyStatus(isSpy) {
    const session = await this.getSession();
    return DataStore.save(
      Session.copyOf(session, (item) => {
        item.spy = isSpy;
      })
    );
  }

  getSessions(boardId: string): Promise<Session[]> {
    const lastAvtiveMin = new Date(new Date().getTime() - 45000);
    return DataStore.query(Session, (session) =>
      session
        .boardID('eq', boardId)
        .lastActive('ge', lastAvtiveMin.toISOString())
    );
  }

  observeSessions(boardId: string) {
    const lastAvtiveMin = new Date(new Date().getTime() - 45000);
    return DataStore.observe(Session, (session) =>
      session
        .boardID('eq', boardId)
        .lastActive('ge', lastAvtiveMin.toISOString())
    );
  }

  getSessions$(boardId: string): Observable<Session[]> {
    let sessions: Session[] = [];
    const observable = new Observable<Session[]>((subscriber) => {
      this.getSessions(boardId).then((data) => {
        sessions = data;
        subscriber.next(sessions);
      });
      this.observeSessions(boardId).subscribe((data) => {
        const newSession = data.element;
        const updatedSessions = sessions
          .filter((session) => session.id !== newSession.id)
          .filter((session) => session.boardID === boardId)
          .filter(
            (session) =>
              new Date(session.lastActive).getTime() >
              lastAvtiveMinimumDate().getTime()
          );
        updatedSessions.push(newSession);
        sessions = updatedSessions;
        subscriber.next(sessions);
      });
    });
    return observable;
  }
}
