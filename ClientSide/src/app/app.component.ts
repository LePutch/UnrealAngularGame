import { Component } from '@angular/core';
import { INITIAL_STATE, IPhase } from './shared/shared-state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'UnrealGame';

  phases: IPhase = INITIAL_STATE;

  ngOnInit() {
    this.test();
  }

  test() {
    this.phases.home = false;
    this.phases.phase1 = true;
  }

  phase1() {
    this.phases.home = false;
    this.phases.phase1 = true;
  }


}
