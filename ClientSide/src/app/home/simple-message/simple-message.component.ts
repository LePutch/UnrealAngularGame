import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { WebSocketConnexionService } from 'src/app/shared/services/web-socket-connexion.service';

@Component({
  selector: 'app-simple-message',
  templateUrl: './simple-message.component.html',
  styleUrls: ['./simple-message.component.scss']
})
export class SimpleMessageComponent implements OnDestroy {

  private unsubscribe$ = new Subject<void>();

  constructor(private websocketService: WebSocketConnexionService) { }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  sendMessage(message: string) {
    this.websocketService.sendChatMessage(message);
  }
}