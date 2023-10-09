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

  ngOnInit() {
    // Récupérez la div dont vous voulez mesurer la largeur
    const maDiv = document.querySelector('.hexaWidth') as HTMLElement;

    // Récupérez sa largeur calculée en pixels
    const largeurDiv = maDiv.offsetWidth;

    // Mettez à jour une variable CSS avec la largeur calculée
    document.documentElement.style.setProperty('--hexa-width', `${largeurDiv}px`);
  }

}