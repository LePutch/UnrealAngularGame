import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { INITIAL_STATE, IPhase } from '../shared/shared-state';

@Component({
  selector: 'app-level-infos',
  templateUrl: './level-infos.component.html',
  styleUrls: ['./level-infos.component.scss']
})
export class LevelInfosComponent implements OnChanges {
  @Input()
  phases: IPhase;

  constructor() {
    this.phases = INITIAL_STATE;
  }


  ngOnChanges(changes: SimpleChanges) {
  }


}
