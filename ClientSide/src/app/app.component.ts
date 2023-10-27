import { Component } from '@angular/core';
import { INITIAL_STATE, IPhase } from './shared/shared-state';
import { Subject, takeUntil } from 'rxjs';
import { WebSocketConnexionService } from './shared/services/web-socket-connexion.service';
import { MatDialog } from '@angular/material/dialog';
import { NavypopupComponent } from './navypopup/navypopup.component';
export interface DialogNavyData {
  title: string;
  content: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'UnrealGame';

  phases: IPhase = INITIAL_STATE;
  private unsubscribe$ = new Subject<void>();
  constructor(private websocketService: WebSocketConnexionService, public dialog: MatDialog) { }

  wantARide: boolean = false;

  ngOnInit() {
    // this.test();
    // this.phases.home = false;
    // this.phases.phase2 = true;
    // this.phases.phase1 = false;
    // this.phases.spawn = false;
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

    if (message.type === 'phase') {
      this.handlePhase(message.content);
    }
    if (message.type === 'navy') {
      this.handleNavy(message.content);
    }

  }

  handleNavy(where: string) {
    if (where === 'redPower') {
      this.openDialog('1500ms', '1500ms', 'Fragment Unveiled', 'Eben, this crystal contains a piece of my soul. Collecting it will grant you a speed boost.', 'redPower')
    }
    if (where === 'denial') {
      this.openDialog('1500ms', '1500ms', 'Reconnected', "Eben, you've rekindled the connection. But there's more we must discover. Meet me near my resting place. ", 'denial')
    }
    if (where === 'lastRoomAnger') {
      this.openDialog('1500ms', '1500ms', 'Entering the Spirit Realm', 'Eben, this room seems perilous. Allow me to enter your mind and guide you into the realm of the spirits.', 'lastRoomAnger')
    }
    if (where === 'bluePower') {
      this.openDialog('1500ms', '1500ms', 'Empowered by the Blue Gem', "You've obtained another piece of my soul. Now, you can shift between dimensions with its power !", 'bluePower')
    }
    if (where === 'depression') {
      this.openDialog('1500ms', '1500ms', "Green Gem's Blessing", 'This green gem contains a part of my soul, allowing you to manipulate time and space, granting you the power of teleportation. ', 'depression')
    }
    if (where === 'tomb') {
      this.openDialog('1500ms', '1500ms', 'Guiding at the Grave', "This is where i sleep now.. Do you remember ? Don't forget to pick up the lantern, Eben. It symbolizes the light within you.", 'tomb')
    }
    if (where === 'tombRise') {
      this.openDialog('1500ms', '1500ms', 'Rising Together', "Whenever you're ready, Eben, you can ascend to the skies, into the world of 'Rise', and rebuild what was lost.", 'tombRise')
    }
    if (where === 'rise') {
      this.openDialog('1500ms', '1500ms', 'Be Free', "Eben, you can now soar higher than before. A double-jump is your path to greater heights.", 'rise')
    }
    if (where === 'endGame') {
      this.openDialog('1500ms', '1500ms', 'Embracing Freedom.', "You've grown, Eben. You're free to explore this world on your own nom, soaring like the wind. The journey through grief has come to an end. But don't forget, I always be with you.", 'endGame')
    }
    if (where === 'ride') {
      this.wantARide = true;
      console.log('want a ride true')
    }

  }

  rideRaft() {
    this.wantARide = false;
    this.websocketService.sendClientTypeAndContent('navyDestroy', 'ride');
  }

  popupTest() {
    this.openDialog('1500ms', '1500ms', 'Red Power', 'Red Power is now available', 'redPower')
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, title: string, content: string, contentToSend: string): void {
    const dialogRef = this.dialog.open(NavypopupComponent, {
      width: '80%',
      height: '80%',
      enterAnimationDuration,
      exitAnimationDuration,
      data: { title: title, content: content },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.websocketService.sendClientTypeAndContent('navyDestroy', contentToSend);
    });
  }


  handlePhase(phase: string) {
    console.log(phase, this.phases)

    switch (phase) {

      case 'spawn':
        this.phases.home = false;
        this.phases.phase1 = false;
        this.phases.phase2 = false;
        this.phases.phase3 = false;
        this.phases.phase4 = false;
        this.phases.phase5 = false;
        this.phases.spawn = true;
        break;
      case 'phase1':
        this.phases.home = false;
        this.phases.phase1 = true;
        this.phases.phase2 = false;
        this.phases.phase3 = false;
        this.phases.phase4 = false;
        this.phases.phase5 = false;
        this.phases.spawn = false;
        break;
      case 'phase2':
        this.phases.home = false;
        this.phases.phase1 = false;
        this.phases.phase2 = true;
        this.phases.phase3 = false;
        this.phases.phase4 = false;
        this.phases.phase5 = false;
        this.phases.spawn = false;
        break;
      case 'phase3':
        this.phases.home = false;
        this.phases.phase1 = false;
        this.phases.phase2 = false;
        this.phases.phase3 = true;
        this.phases.phase4 = false;
        this.phases.phase5 = false;
        this.phases.spawn = false;
        break;
      case 'phase4':
        this.phases.home = false;
        this.phases.phase1 = false;
        this.phases.phase2 = false;
        this.phases.phase3 = false;
        this.phases.phase4 = true;
        this.phases.phase5 = false;
        this.phases.spawn = false;
        break;

    }
  }


  test() {
    this.phases.home = false;
    this.phases.phase1 = true;
  }

  phase1() {
    this.phases.home = false;
    this.phases.phase1 = true;
  }

  bluePower: boolean = false;
  redPower: boolean = false;
  greenPower: boolean = false;


  handleGems(gem: string) {
    switch (gem) {
      case 'green':
        this.greenPower = !this.greenPower;
        break;
      case 'blue':
        this.bluePower = !this.bluePower;
        break;
      case 'red':
        this.redPower = !this.redPower;
        break;
    }
  }

}
