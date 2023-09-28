import { Component, Input } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { WebSocketConnexionService } from 'src/app/shared/services/web-socket-connexion.service';

@Component({
  selector: 'app-joining-room',
  templateUrl: './joining-room.component.html',
  styleUrls: ['./joining-room.component.scss']
})
export class JoiningRoomComponent {
  private unsubscribe$ = new Subject<void>();

  @Input()
  roomCode: string = '';

  connected: boolean = false;
  errorMessage: string = '';
  message: string = '';

  constructor(private websocketService: WebSocketConnexionService) { }

  ngOnInit() {
    this.generateStars();
    this.websocketService.getSocket()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(
        (message) => {
          console.log('Received:', message);
          this.messageHandler(message);
        },
        (err) => {
          console.error('Error:', err);
        },
        () => {
          console.log('WebSocket connection closed.');
        }
      );

    this.joinRoom();
  }

  private generateStars() {
    const starsContainer = document.querySelector('.stars') as HTMLElement;
    const numStars = 100; // Nombre d'étoiles à générer

    for (let i = 0; i < numStars; i++) {
      const star = document.createElement('div');
      star.classList.add('star');
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      starsContainer.appendChild(star);
    }
  }

  messageHandler(message: any) {
    if (message.type === 'error') {
      this.errorMessage = message.message;
    }
    if (message.type === 'roomJoined') {
      this.message = message.message;
      this.connected = true;
    }
  }

  SendGreenLantern() {
    this.websocketService.sendBasicMessage('greenLantern');
  }

  SendRedLantern() {
    this.websocketService.sendBasicMessage('redLantern');
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  joinRoom() {
    this.websocketService.joinRoom(this.roomCode);
  }
}
