import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  connected: boolean = false;
  qrCode: boolean = false;
  joiningRoom: string = '';

  ngOnInit() {
    // check the url to see if we have the option "room" in it
    const urlParams = new URLSearchParams(window.location.search);
    const room = urlParams.get('room');
    if (room) {
      this.qrCode = true;
      this.joiningRoom = room;
    }
  }

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
