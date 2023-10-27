import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { WebSocketConnexionService } from '../shared/services/web-socket-connexion.service';

@Component({
  selector: 'app-spawn',
  templateUrl: './spawn.component.html',
  styleUrls: ['./spawn.component.scss']
})
export class SpawnComponent {

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
          }
          this.messageHandler(message);
        },
        (err) => {
          console.error('Error:', err);
        },
        () => {
        }
      );
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
