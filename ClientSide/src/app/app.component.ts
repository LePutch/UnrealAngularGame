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



  ngOnInit() {
    // this.test();
    // this.phases.home = false;
    // this.phases.phase1 = true;
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
      this.openDialog('1500ms', '1500ms', 'Red Power', 'Red Power is now available', 'redPower')
    }
    if (where === 'denial') {
      this.openDialog('1500ms', '1500ms', 'THANK YOU !', 'You freed me ! Please join me at my tomb.. ', 'denial')
    }
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
      case 'phase2':
        this.phases.home = false;
        this.phases.phase1 = false;
        this.phases.phase2 = true;
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
