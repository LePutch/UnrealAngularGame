import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { WebSocketConnexionService } from 'src/app/shared/services/web-socket-connexion.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {


  private unsubscribe$ = new Subject<void>();

  constructor(private websocketConnexionService: WebSocketConnexionService) { }


  jump() {
    this.websocketConnexionService.jump();
  }
}
