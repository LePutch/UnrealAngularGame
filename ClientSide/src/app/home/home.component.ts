import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  connected: boolean = false;
  qrCode: boolean = false;
  joiningRoom: string = '';
  admin: boolean = false;

  @Output()
  phase1 = new EventEmitter();

  ngOnInit() {
    // check the url to see if we have the option room in it
    const urlParams = new URLSearchParams(window.location.search);
    const room = urlParams.get('room');
    if (room) {
      this.qrCode = true;
      this.joiningRoom = room;
    }

    // check if we are admin
    const admin = urlParams.get('admin');
    if (admin) {
      console.log('admin');
      this.admin = true;
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

  emitPhase1() {
    this.phase1.emit();
  }



}
