import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  @Output()
  readyToPlay = new EventEmitter();

  connected: boolean = false;
  errorMessage: string = '';
  message: string = '';

  constructor(private websocketService: WebSocketConnexionService) { }

  ngOnInit() {
    this.websocketService.getSocket()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(
        (message) => {
          if (message.type !== 'coords') {
            console.log('Received:', message);
          } this.messageHandler(message);
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

  SendCoords() {
    this.websocketService.requestCoords();
  }

  SendRedLantern() {
    this.websocketService.sendBasicMessage('redLantern');
  }


  joinRoom() {
    this.websocketService.joinRoom(this.roomCode);
  }

  runPhase1() {
    const element = document.documentElement as any;
    if (element) {
      if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen(); // Demande le mode plein écran
      } else {
        console.error('La méthode webkitRequestFullscreen n\'est pas prise en charge.');
      }
    }
    if (element.requestFullscreen) {
      console.log('fullscreen')
      element.requestFullscreen();
    }
    else if (!element.requestFullscreen) {
      console.log('fullscreen impossible')
    }

    if (window.screen.orientation) {
      (window.screen.orientation as any).lock('landscape').catch((error: any) => {
        console.error('Failed to lock screen orientation:', error);
      });
    }
    this.readyToPlay.emit();

  }


}
