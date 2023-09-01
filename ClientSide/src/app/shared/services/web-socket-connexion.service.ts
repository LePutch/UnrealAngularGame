import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class WebSocketConnexionService {

  private socket$: WebSocketSubject<any>;
  private roomCode: string = '';

  constructor() {
    this.socket$ = webSocket('ws://192.168.1.7:3000');
  }

  getSocket(): Observable<any> {
    return this.socket$.asObservable();
  }

  createRoom() {
    const message = {
      type: 'createRoom'
    };
    this.socket$.next(message);
  }

  jump() {
    const message = {
      type: 'jump'
    };
    this.socket$.next(message);
  }

  joinRoom(roomCode: string) {
    const message = {
      type: 'joinRoom',
      roomCode: roomCode
    };
    this.socket$.next(message);
  }

  sendChatMessage(content: string) {
    const message = {
      type: 'chat',
      roomCode: this.roomCode,
      content: content
    };
    this.socket$.next(message);
  }


  setRoomCode(roomCode: string) {
    this.roomCode = roomCode;
  }

  getRoomCode(): string {
    return this.roomCode;
  }
}

