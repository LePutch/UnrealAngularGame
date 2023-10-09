import { AfterViewInit, Component, ElementRef, HostListener, Input, OnChanges, OnInit, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { NgProgress } from 'ngx-progressbar';
import { INITIAL_STATE, IPhase } from '../shared/shared-state';

@Component({
  selector: 'app-power-infos',
  templateUrl: './power-infos.component.html',
  styleUrls: ['./power-infos.component.scss']
})
export class PowerInfosComponent {
  @ViewChild('hTotDiv', { static: true })
  hTotDiv!: ElementRef;

  @Input()
  phases: IPhase;

  circleSize!: number;
  radiusBar!: number;

  constructor(private ngProgress: NgProgress, private renderer: Renderer2) {
    this.phases = INITIAL_STATE
  }

  onInit() {
    this.updateDimensions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateDimensions();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateDimensions();
  }

  updateDimensions(): void {
    const hTotHeight = this.hTotDiv.nativeElement.clientHeight;
    this.circleSize = hTotHeight / 3 - 30;
    this.radiusBar = this.circleSize / 2 + 5;
    const circles = document.querySelectorAll('.circle');
    circles.forEach(circle => {
      this.renderer.setStyle(circle, 'width', this.circleSize + 'px');
      this.renderer.setStyle(circle, 'height', this.circleSize + 'px');
    });
  }



}
