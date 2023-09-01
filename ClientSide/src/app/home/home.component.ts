import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  connected: boolean = false;

  handleConnexionStatus(status: string) {
    switch (status) {
      case 'disconnected':
        this.connected = false;
        break;
      case 'error':
        this.connected = false;
        break;
      default:
        this.connected = true;
        break;
    }
  }
}
