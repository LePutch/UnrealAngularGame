import { Component, Input } from '@angular/core';
import { INITIAL_STATE, IPhase } from '../shared/shared-state';

@Component({
  selector: 'app-level-infos',
  templateUrl: './level-infos.component.html',
  styleUrls: ['./level-infos.component.scss']
})
export class LevelInfosComponent {
  @Input()
  phases: IPhase;

  constructor() {
    this.phases = INITIAL_STATE;
  }

  ngOnInit() {

  }


}
