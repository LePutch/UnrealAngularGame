import { Component, EventEmitter, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { WebSocketConnexionService } from 'src/app/shared/services/web-socket-connexion.service';

@Component({
  selector: 'app-server-connexion',
  templateUrl: './server-connexion.component.html',
  styleUrls: ['./server-connexion.component.scss']
})
export class ServerConnexionComponent {
  roomCode: string = '';

  @Output()
  connexionStatus = new EventEmitter<string>();

  private unsubscribe$ = new Subject<void>();

  constructor(private websocketConnexionService: WebSocketConnexionService) { }

  joinRoom() {
    this.websocketConnexionService.joinRoom(this.roomCode);
  }

  createRoom() {
    this.websocketConnexionService.createRoom();
  }

  ngOnInit() {
    this.websocketConnexionService.getSocket()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(
        (message) => {
          this.connexionStatus.emit("connected");
          if (message.type !== 'coords') {
            console.log('Received:', message);
          }          // Traitez le message reçu ici
          if (message.type === 'roomCreated') {
            const roomCode = message.roomCode;
            this.websocketConnexionService.setRoomCode(roomCode);
          }
        },
        (err) => {
          this.connexionStatus.emit("error");
          console.error('Error:', err);
        },
        () => {
          this.connexionStatus.emit("disconnected");
          console.log('WebSocket connection closed.');
        }
      );

  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}