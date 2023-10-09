import { Component, Input } from '@angular/core';
import { IPhase, INITIAL_STATE } from '../shared/shared-state';

@Component({
  selector: 'app-board-infos',
  templateUrl: './board-infos.component.html',
  styleUrls: ['./board-infos.component.scss']
})
export class BoardInfosComponent {
  @Input()
  phases: IPhase;

  constructor() {
    this.phases = INITIAL_STATE;
  }

}