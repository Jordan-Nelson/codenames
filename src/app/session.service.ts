import { Injectable } from '@angular/core';
import { DataStore } from 'aws-amplify';
import { Observable } from 'rxjs';
import { Session, Team } from '../models';

function generateRandomNumber(): number {
  return Math.floor(1000 + Math.random() * 9000);
}

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  storage = window.localStorage;

  constructor() {}

  getSessionId() {
    return localStorage.getItem('sessionId');
  }

  setSessionId(id: string) {
    localStorage.setItem('sessionId', id);
  }

  async joinBoard(boardId: string): Promise<Session> {
    const sessionId = this.getSessionId();
    if (sessionId) {
      const session = await DataStore.query(Session, sessionId);
      if (session && session.boardID === boardId) {
        return session;
      } else if (session) {
        return this.addSessionToBoard(boardId, session);
      }
    }
    return this.createSession(boardId);
  }

  addSessionToBoard(boardId: string, session: Session) {
    return DataStore.save(
      Session.copyOf(session, (item) => {
        item.lastActive = new Date().toISOString();
        item.boardID = boardId;
      })
    );
  }

  createSession(boardId: string): Promise<Session> {
    const username = 'User' + generateRandomNumber();
    const displayName =
      window.prompt('Enter a display name', username) || username;
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
    return DataStore.query(Session, sessionId);
  }

  async updateSessionLastActive(boardId: string): Promise<Session> {
    const session = await this.getSession();
    return DataStore.save(
      Session.copyOf(session, (item) => {
        item.lastActive = new Date().toISOString();
        item.boardID = boardId;
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

  getSessions(boardId: string): Promise<Session[]> {
    const lastAvtiveMin = new Date(new Date().getTime() - 1 * 60000);
    return DataStore.query(Session, (session) =>
      session
        .boardID('eq', boardId)
        .lastActive('ge', lastAvtiveMin.toISOString())
    );
  }

  observeSessions(boardId: string) {
    const lastAvtiveMin = new Date(new Date().getTime() + 3 * 60000);
    return DataStore.observe(Session, (session) =>
      session
        .boardID('eq', boardId)
        .lastActive('ge', lastAvtiveMin.toISOString())
    );
  }

  getSessions$(boardId: string): Observable<Session[]> {
    const observable = new Observable<Session[]>((subscriber) => {
      const getSessions = () => {
        this.getSessions(boardId).then((sessions) => {
          subscriber.next(sessions);
          setTimeout(() => {
            getSessions();
          }, 3000);
        });
      };
      getSessions();
    });
    return observable;
  }
}
