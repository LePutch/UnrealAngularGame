import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { WebSocketConnexionService } from '../shared/services/web-socket-connexion.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  private unsubscribe$ = new Subject<void>();

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
          } this.messageHandler(message);
        },
        (err) => {
          console.error('Error:', err);
        },
        () => {
        }
      );

    this.createAdminRoom();
  }

  createAdminRoom() {
    this.websocketService.createAdminRoom();
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

  code() {
    this.websocketService.sendAdminTypeAndContent('anger', 'code')
  }

  noCode() {
    this.websocketService.sendAdminTypeAndContent('anger', 'noCode')
  }

  destroyNavy(where: string) {
    this.websocketService.sendAdminTypeAndContent('destroyNavy', where);
  }

  greenGems() {
    this.websocketService.sendAdminTypeAndContent('gems', 'green');
  }

  redGems() {
    this.websocketService.sendAdminTypeAndContent('gems', 'red');
  }

  blueGems() {
    this.websocketService.sendAdminTypeAndContent('gems', 'blue');
  }

  phase(phase: string) {
    this.websocketService.sendAdminTypeAndContent('phase', phase);
  }

  angerLastRoom() {
    this.websocketService.sendAdminTypeAndContent('anger', 'lastRoom');
  }
  navyRide() {
    this.websocketService.sendAdminTypeAndContent('navy', 'ride');
  }

  printRooms() {
    this.websocketService.sendAdminTypeAndContent('print', 'rooms');
  }

}
