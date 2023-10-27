import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { WebSocketConnexionService } from 'src/app/shared/services/web-socket-connexion.service';

@Component({
  selector: 'app-ghostpower',
  templateUrl: './ghostpower.component.html',
  styleUrls: ['./ghostpower.component.scss']
})
export class GhostpowerComponent {
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

  messageHandler(message: any) {
    throw new Error('Method not implemented.');
  }

  ghostPower() {
    this.websocketService.sendClientTypeAndContent('anger', 'ghost');
  }
}
