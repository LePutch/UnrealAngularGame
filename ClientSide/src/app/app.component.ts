import { Component } from '@angular/core';
import { INITIAL_STATE, IPhase } from './shared/shared-state';
import { Subject, takeUntil } from 'rxjs';
import { WebSocketConnexionService } from './shared/services/web-socket-connexion.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'UnrealGame';

  phases: IPhase = INITIAL_STATE;
  private unsubscribe$ = new Subject<void>();
  constructor(private websocketService: WebSocketConnexionService) { }

  ngOnInit() {
    // this.test();
    this.phases.home = true;
    this.phases.phase1 = true;
    this.phases.spawn = false;
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
  }

  handlePhase(phase: string) {
    switch (phase) {
      case 'Phase 1':
        this.phases.home = false;
        this.phases.phase1 = true;
        this.phases.spawn = false;
        break;
      case 'spawn':
        this.phases.home = false;
        this.phases.phase1 = false;
        this.phases.phase2 = false;
        this.phases.phase3 = false;
        this.phases.phase4 = false;
        this.phases.phase5 = false;
        this.phases.spawn = true;
        break;
      case 'Phase 2':
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
    this.phases.spawn = true;
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
