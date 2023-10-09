import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-power-infos',
  templateUrl: './power-infos.component.html',
  styleUrls: ['./power-infos.component.scss']
})
export class PowerInfosComponent {
  @ViewChild('hTotDiv', { static: true })
  hTotDiv!: ElementRef;

  constructor(private renderer: Renderer2) { }
  variableLevel: number = 0; // Le niveau de la variable

  onCircleClick(circleNumber: number): void {
    if (this.variableLevel >= 10) {
      // Logique à exécuter lorsqu'un rond est cliqué et que la variable est à 10 ou plus
      console.log('Rond ' + circleNumber + ' cliqué!');
    }
  }
  ngOnInit(): void {
    const hTotHeight = this.hTotDiv.nativeElement.clientHeight;
    const circleSize = hTotHeight / 3 - 15;
    const circles = document.querySelectorAll('.circle');
    circles.forEach(circle => {
      this.renderer.setStyle(circle, 'width', circleSize + 'px');
      this.renderer.setStyle(circle, 'height', circleSize + 'px');
    });
  }

}
