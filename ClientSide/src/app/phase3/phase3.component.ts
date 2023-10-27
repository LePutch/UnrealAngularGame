import { Component, SimpleChanges } from '@angular/core';
import { WhiteboardElement } from 'ng-whiteboard';
import { Subject, takeUntil } from 'rxjs';
import { WebSocketConnexionService } from '../shared/services/web-socket-connexion.service';

@Component({
  selector: 'app-phase3',
  templateUrl: './phase3.component.html',
  styleUrls: ['./phase3.component.scss']
})
export class Phase3Component {
  characterX: number = 0;
  characterY: number = 0;


  private unsubscribe$ = new Subject<void>();
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
          }
          this.messageHandler(message);
        },
        (err) => {
          console.error('Error:', err);
        },
        () => {
          console.log('WebSocket connection closed.');
        }
      );
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }



  messageHandler(message: any) {
    if (message.type === 'coords') {
      const parts = message.message.split(' ');
      const xValue = parseFloat(parts[0].split('=')[1]);
      const yValue = parseFloat(parts[1].split('=')[1]);
      this.characterX = xValue;
      this.characterY = yValue;
    }
  }
}
